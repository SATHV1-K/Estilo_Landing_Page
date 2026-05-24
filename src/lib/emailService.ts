// ─── Contact Form Notification ────────────────────────────────────────────────

export interface ContactNotificationPayload {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}

// Delegates to the server-side handler (/api/contact-notify) to avoid CORS
// and keep the Resend API key out of the browser bundle.
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<void> {
  const res = await fetch('/api/contact-notify', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Contact notification failed: ${body}`);
  }
}

export interface AlertEmailPayload {
  title:      string;
  message:    string;
  link?:      string;
  linkLabel?: string;
  type:       'info' | 'warning' | 'promo';
}

export async function sendAlertToSubscribers(
  subscribers: string[],
  payload: AlertEmailPayload,
  fromAddress: string
): Promise<{ sent: number; errors: number }> {
  if (subscribers.length === 0) return { sent: 0, errors: 0 };

  const res = await fetch('/api/send-alert', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ subscribers, payload, fromAddress }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Send alert failed: ${body}`);
  }

  return res.json();
}
