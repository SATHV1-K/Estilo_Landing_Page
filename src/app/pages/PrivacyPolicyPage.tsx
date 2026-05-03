import { motion } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { staggerContainer, fadeInUp } from '../../lib/animations';

const EFFECTIVE_DATE = 'May 1, 2025';
const STUDIO_NAME    = 'Estilo Latino Dance Company';
const STUDIO_ADDRESS = '345 Morris Ave Ste 1B, Elizabeth, NJ 07208';
const STUDIO_EMAIL   = 'info@EstiloLatinoDance.com';
const STUDIO_PHONE   = '+1 (201) 878-8977';

interface Section {
  heading: string;
  heading_es: string;
  body: string;
  body_es: string;
}

const sections: Section[] = [
  {
    heading: '1. Information We Collect',
    heading_es: '1. Información que Recopilamos',
    body: `We collect information you provide directly when you enroll in classes, register on our website, contact us, or subscribe to our newsletter. This may include your full name, email address, phone number, mailing address, date of birth (for minors enrolled in Kids programs), and payment information processed securely through our third-party payment processor, Square.

We also collect certain technical information automatically when you visit our website, including IP address, browser type, pages viewed, and referring URLs, through standard web server logs and cookies.`,
    body_es: `Recopilamos información que usted proporciona directamente cuando se inscribe en clases, se registra en nuestro sitio web, nos contacta o se suscribe a nuestro boletín informativo. Esto puede incluir su nombre completo, dirección de correo electrónico, número de teléfono, dirección postal, fecha de nacimiento (para menores inscritos en programas para niños) e información de pago procesada de forma segura a través de nuestro procesador de pagos externo, Square.

También recopilamos cierta información técnica automáticamente cuando visita nuestro sitio web, incluyendo dirección IP, tipo de navegador, páginas visitadas y URL de referencia, a través de registros de servidor web estándar y cookies.`,
  },
  {
    heading: '2. How We Use Your Information',
    heading_es: '2. Cómo Utilizamos su Información',
    body: `We use the information we collect to:

• Process class enrollments, registrations, and payments
• Communicate with you about your classes, schedule changes, and studio news
• Send our newsletter and promotional materials (only if you have opted in)
• Respond to your inquiries and provide customer support
• Improve our website, programs, and services
• Comply with legal obligations and enforce our policies

We will never sell, rent, or trade your personal information to third parties for their own marketing purposes.`,
    body_es: `Utilizamos la información recopilada para:

• Procesar inscripciones a clases, registros y pagos
• Comunicarnos con usted sobre sus clases, cambios de horario y noticias del estudio
• Enviar nuestro boletín y materiales promocionales (solo si usted ha dado su consentimiento)
• Responder a sus consultas y brindar servicio al cliente
• Mejorar nuestro sitio web, programas y servicios
• Cumplir con obligaciones legales y hacer cumplir nuestras políticas

Nunca venderemos, alquilaremos ni intercambiaremos su información personal a terceros para sus propios fines de marketing.`,
  },
  {
    heading: '3. Sharing of Information',
    heading_es: '3. Compartir Información',
    body: `We may share your information with trusted service providers who assist us in operating our website and conducting our business, including:

• Square, Inc. — for payment processing. Square's privacy policy governs the handling of your payment data.
• Email service providers — for newsletter and transactional email delivery.

These providers are contractually obligated to keep your information confidential and use it only for the services they provide to us.

We may also disclose information when required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.`,
    body_es: `Podemos compartir su información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web y realizar nuestro negocio, incluyendo:

• Square, Inc. — para el procesamiento de pagos. La política de privacidad de Square rige el manejo de sus datos de pago.
• Proveedores de servicios de correo electrónico — para la entrega de boletines y correos transaccionales.

Estos proveedores están contractualmente obligados a mantener su información confidencial y a utilizarla solo para los servicios que nos brindan.

También podemos divulgar información cuando lo exija la ley, una orden judicial o una autoridad gubernamental, o cuando creamos que la divulgación es necesaria para proteger nuestros derechos, su seguridad o la seguridad de otros.`,
  },
  {
    heading: '4. Children\'s Privacy (COPPA)',
    heading_es: '4. Privacidad de los Niños (COPPA)',
    body: `Our Kids program enrolls children under the age of 13. We collect information about minors only from their parents or legal guardians, and only as necessary for enrollment and studio operations. We do not knowingly collect personal information directly from children under 13 without verifiable parental consent.

Parents and guardians may review, correct, or request deletion of their child's information by contacting us at ${STUDIO_EMAIL}.`,
    body_es: `Nuestro programa para niños inscribe a menores de 13 años. Recopilamos información sobre menores únicamente de sus padres o tutores legales, y solo en la medida necesaria para la inscripción y las operaciones del estudio. No recopilamos intencionalmente información personal directamente de niños menores de 13 años sin el consentimiento verificable de los padres.

Los padres y tutores pueden revisar, corregir o solicitar la eliminación de la información de su hijo contactándonos en ${STUDIO_EMAIL}.`,
  },
  {
    heading: '5. Cookies',
    heading_es: '5. Cookies',
    body: `Our website uses essential cookies necessary for the site to function properly (e.g., session management and language preference). We may also use analytics cookies to understand how visitors use our site. You can control or disable non-essential cookies through your browser settings; however, disabling cookies may affect some functionality of the site.`,
    body_es: `Nuestro sitio web utiliza cookies esenciales necesarias para el correcto funcionamiento del sitio (por ejemplo, gestión de sesiones y preferencia de idioma). También podemos usar cookies de análisis para entender cómo los visitantes utilizan nuestro sitio. Puede controlar o deshabilitar las cookies no esenciales a través de la configuración de su navegador; sin embargo, deshabilitar las cookies puede afectar algunas funcionalidades del sitio.`,
  },
  {
    heading: '6. Data Security',
    heading_es: '6. Seguridad de los Datos',
    body: `We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Payment transactions are processed by Square and are encrypted using industry-standard TLS/SSL technology. We do not store full credit card numbers on our servers.

No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    body_es: `Implementamos salvaguardas administrativas, técnicas y físicas razonables para proteger su información personal de acceso, divulgación, alteración o destrucción no autorizados. Las transacciones de pago son procesadas por Square y están encriptadas utilizando tecnología TLS/SSL estándar de la industria. No almacenamos números de tarjetas de crédito completos en nuestros servidores.

Ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por proteger su información, no podemos garantizar seguridad absoluta.`,
  },
  {
    heading: '7. Your Rights & Choices',
    heading_es: '7. Sus Derechos y Opciones',
    body: `You have the right to:

• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your personal information, subject to any legal retention obligations
• Opt out of marketing emails at any time using the unsubscribe link in any email or by contacting us directly
• Request that we restrict or limit how we use your information

To exercise any of these rights, please contact us at ${STUDIO_EMAIL} or by mail at ${STUDIO_ADDRESS}.`,
    body_es: `Usted tiene derecho a:

• Acceder a la información personal que tenemos sobre usted
• Corregir información inexacta o incompleta
• Solicitar la eliminación de su información personal, sujeto a cualquier obligación legal de retención
• Darse de baja de correos de marketing en cualquier momento usando el enlace de cancelación de suscripción en cualquier correo o contactándonos directamente
• Solicitar que restrinjamos o limitemos cómo usamos su información

Para ejercer cualquiera de estos derechos, contáctenos en ${STUDIO_EMAIL} o por correo postal en ${STUDIO_ADDRESS}.`,
  },
  {
    heading: '8. Data Retention',
    heading_es: '8. Retención de Datos',
    body: `We retain personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Student enrollment records are retained for a minimum of seven (7) years as required by New Jersey business record-keeping practices. When information is no longer needed, we securely delete or anonymize it.`,
    body_es: `Conservamos la información personal durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo satisfacer requisitos legales, contables o de informes. Los registros de inscripción de estudiantes se conservan por un mínimo de siete (7) años según lo requieren las prácticas de mantenimiento de registros comerciales de Nueva Jersey. Cuando la información ya no es necesaria, la eliminamos de forma segura o la anonimizamos.`,
  },
  {
    heading: '9. Changes to This Policy',
    heading_es: '9. Cambios a Esta Política',
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will update the effective date at the top of this page and, where appropriate, notify you by email or by posting a prominent notice on our website. Your continued use of our services after any changes constitutes your acceptance of the updated policy.`,
    body_es: `Podemos actualizar esta Política de Privacidad periódicamente. Cuando realicemos cambios materiales, actualizaremos la fecha de vigencia en la parte superior de esta página y, cuando corresponda, le notificaremos por correo electrónico o publicando un aviso destacado en nuestro sitio web. El uso continuo de nuestros servicios después de cualquier cambio constituye su aceptación de la política actualizada.`,
  },
  {
    heading: '10. Governing Law',
    heading_es: '10. Ley Aplicable',
    body: `This Privacy Policy is governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict-of-law provisions.`,
    body_es: `Esta Política de Privacidad se rige e interpreta de acuerdo con las leyes del Estado de Nueva Jersey, Estados Unidos, sin tener en cuenta sus disposiciones sobre conflicto de leyes.`,
  },
  {
    heading: '11. Contact Us',
    heading_es: '11. Contáctenos',
    body: `If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us:

${STUDIO_NAME}
${STUDIO_ADDRESS}
Phone: ${STUDIO_PHONE}
Email: ${STUDIO_EMAIL}`,
    body_es: `Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el manejo de su información personal, contáctenos:

${STUDIO_NAME}
${STUDIO_ADDRESS}
Teléfono: ${STUDIO_PHONE}
Correo electrónico: ${STUDIO_EMAIL}`,
  },
];

export function PrivacyPolicyPage() {
  const { language } = useI18n();
  const isEs = language === 'es';

  return (
    <motion.main
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="bg-bg min-h-screen pt-32 pb-24"
    >
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-12">
          <h1 className="font-display text-section text-white uppercase mb-4">
            {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
          </h1>
          <p className="text-text-muted text-sm">
            {isEs ? `Fecha de vigencia: ${EFFECTIVE_DATE}` : `Effective Date: ${EFFECTIVE_DATE}`}
          </p>
          <p className="text-text mt-6 leading-relaxed">
            {isEs
              ? `${STUDIO_NAME} ("nosotros", "nuestro" o "el Estudio") opera el sitio web EstiloLatinoDance.com y los servicios de inscripción relacionados. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando interactúa con nosotros.`
              : `${STUDIO_NAME} ("we," "our," or "the Studio") operates EstiloLatinoDance.com and related enrollment services. This Privacy Policy explains how we collect, use, share, and protect your personal information when you interact with us.`
            }
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              variants={fadeInUp}
              className="border-t border-border pt-8"
            >
              <h2 className="font-display text-xl text-gold uppercase mb-4">
                {isEs ? section.heading_es : section.heading}
              </h2>
              <div className="text-text leading-relaxed whitespace-pre-line">
                {isEs ? section.body_es : section.body}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer note */}
        <motion.p variants={fadeInUp} className="mt-16 text-text-muted text-xs leading-relaxed border-t border-border pt-8">
          {isEs
            ? 'Este documento es solo para fines informativos y no constituye asesoramiento legal. Si tiene preguntas sobre sus derechos legales, consulte a un abogado calificado.'
            : 'This document is for informational purposes only and does not constitute legal advice. If you have questions about your legal rights, please consult a qualified attorney.'
          }
        </motion.p>
      </div>
    </motion.main>
  );
}
