import { useState, useEffect, useCallback } from 'react';
import { Mail, MailOpen, Trash2, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import {
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} from '../../../lib/contactService';
import type { ContactMessage } from '../../../lib/contactService';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = '#F6B000';

const S = {
  page:  'max-w-4xl mx-auto px-4 sm:px-6 py-8',
  card:  'bg-white rounded-xl border border-gray-200 shadow-sm',
  label: 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
    hour:  'numeric',
    minute: '2-digit',
  });
}

// ─── Message Row ──────────────────────────────────────────────────────────────

function MessageRow({
  msg,
  onMarkRead,
  onDelete,
}: {
  msg: ContactMessage;
  onMarkRead: (id: string) => void;
  onDelete:   (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={[
        'border rounded-xl overflow-hidden transition-all',
        msg.isRead ? 'border-gray-200' : 'border-amber-300 bg-amber-50/40',
      ].join(' ')}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={() => {
          setExpanded(e => !e);
          if (!msg.isRead) onMarkRead(msg.id);
        }}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0">
          {msg.isRead
            ? <MailOpen size={18} className="text-gray-400" />
            : <Mail size={18} style={{ color: GOLD }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={['text-sm font-bold text-gray-900', !msg.isRead ? 'font-black' : ''].join(' ')}>
              {msg.name}
            </span>
            {!msg.isRead && (
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: `${GOLD}33`, color: GOLD }}
              >
                NEW
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
        </div>
        <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
          {formatDate(msg.createdAt)}
        </div>
      </button>

      {/* Expanded message body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className={S.label}>Name</p>
                <p className="text-gray-800 font-semibold">{msg.name}</p>
              </div>
              <div>
                <p className={S.label}>Email</p>
                <a href={`mailto:${msg.email}`} className="text-amber-600 hover:underline font-semibold">
                  {msg.email}
                </a>
              </div>
              {msg.phone && (
                <div>
                  <p className={S.label}>Phone</p>
                  <a href={`tel:${msg.phone}`} className="text-amber-600 hover:underline font-semibold">
                    {msg.phone}
                  </a>
                </div>
              )}
            </div>

            <div>
              <p className={S.label}>Message</p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                {msg.message}
              </p>
            </div>

            <div className="text-xs text-gray-400 sm:hidden">{formatDate(msg.createdAt)}</div>

            <div className="flex gap-2 pt-1">
              <a
                href={`mailto:${msg.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all hover:opacity-90"
                style={{ background: GOLD, color: '#0A0A0A' }}
              >
                <Mail size={13} /> Reply
              </a>
              <button
                type="button"
                onClick={() => onDelete(msg.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleMarkRead(id: string) {
    try {
      await markMessageRead(id);
      setMessages(ms => ms.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch {
      alert('Failed to update message.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      await deleteContactMessage(id);
      setMessages(ms => ms.filter(m => m.id !== id));
    } catch {
      alert('Failed to delete message.');
    }
  }

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className={S.page}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: GOLD }}
            >
              <MessageSquare size={20} color="#0A0A0A" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none">Messages</h1>
              <p className="text-sm text-gray-500 mt-0.5">Contact form submissions</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {unread > 0 && (
            <span
              className="text-sm font-black px-2.5 py-1 rounded-full"
              style={{ background: `${GOLD}33`, color: GOLD }}
            >
              {unread} unread
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <MessageSquare size={40} strokeWidth={1.5} />
          <p className="text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <MessageRow
              key={msg.id}
              msg={msg}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
