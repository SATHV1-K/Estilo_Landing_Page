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
    heading: '1. Acceptance of Terms',
    heading_es: '1. Aceptación de los Términos',
    body: `By enrolling in classes, purchasing packages, accessing our website, or using any of our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you are enrolling a minor child, you represent that you are the parent or legal guardian of that child and accept these Terms on their behalf.

If you do not agree to these Terms, please do not use our services.`,
    body_es: `Al inscribirse en clases, comprar paquetes, acceder a nuestro sitio web o utilizar cualquiera de nuestros servicios, usted acepta estar sujeto a estos Términos de Servicio y nuestra Política de Privacidad. Si está inscribiendo a un menor de edad, usted declara ser el padre, madre o tutor legal de ese menor y acepta estos Términos en su nombre.

Si no está de acuerdo con estos Términos, le pedimos que no utilice nuestros servicios.`,
  },
  {
    heading: '2. Enrollment & Registration',
    heading_es: '2. Inscripción y Registro',
    body: `Enrollment in classes is complete only upon receipt of full payment and confirmation from the Studio. Class spaces are limited and reserved on a first-come, first-served basis.

You agree to provide accurate, current, and complete information during registration. You are responsible for keeping your account information up to date. The Studio reserves the right to refuse or cancel enrollment at its sole discretion.`,
    body_es: `La inscripción en clases se completa únicamente al recibir el pago completo y la confirmación del Estudio. Los cupos en las clases son limitados y se reservan por orden de llegada.

Usted se compromete a proporcionar información precisa, actual y completa durante el registro. Es responsable de mantener actualizada la información de su cuenta. El Estudio se reserva el derecho de rechazar o cancelar inscripciones a su entera discreción.`,
  },
  {
    heading: '3. Fees, Payment & Refunds',
    heading_es: '3. Tarifas, Pago y Reembolsos',
    body: `All fees are stated in U.S. dollars. Payment is due at the time of enrollment unless otherwise agreed in writing. We accept credit/debit cards and other payment methods as indicated at the point of sale, processed securely through Square, Inc.

Refund Policy:
• Class packages and monthly memberships are non-refundable once purchased.
• If the Studio cancels a class session, enrolled students will receive a makeup class or pro-rated credit toward a future session — not a cash refund.
• A written refund request submitted before the first class of a new session may be considered on a case-by-case basis at the Studio's sole discretion.
• No refunds will be issued for missed classes, regardless of reason.

Chargebacks: If you initiate a chargeback with your bank or card issuer in lieu of following this refund policy, the Studio reserves the right to terminate your enrollment and pursue recovery of any disputed amounts.`,
    body_es: `Todas las tarifas se indican en dólares estadounidenses. El pago vence al momento de la inscripción, a menos que se acuerde lo contrario por escrito. Aceptamos tarjetas de crédito/débito y otros métodos de pago indicados en el punto de venta, procesados de forma segura a través de Square, Inc.

Política de Reembolsos:
• Los paquetes de clases y membresías mensuales no son reembolsables una vez adquiridos.
• Si el Estudio cancela una sesión de clase, los estudiantes inscritos recibirán una clase de recuperación o un crédito proporcional para una sesión futura — no un reembolso en efectivo.
• Una solicitud de reembolso por escrito presentada antes de la primera clase de una nueva sesión puede ser considerada caso por caso a discreción exclusiva del Estudio.
• No se emitirán reembolsos por clases no asistidas, independientemente del motivo.

Contracargos: Si inicia un contracargo con su banco o emisor de tarjeta en lugar de seguir esta política de reembolsos, el Estudio se reserva el derecho de cancelar su inscripción y buscar la recuperación de cualquier monto disputado.`,
  },
  {
    heading: '4. Class Cancellations & Schedule Changes',
    heading_es: '4. Cancelaciones de Clases y Cambios de Horario',
    body: `The Studio reserves the right to cancel, reschedule, or modify classes due to low enrollment, instructor unavailability, holidays, inclement weather, or other circumstances beyond our control. We will make reasonable efforts to notify enrolled students of changes via email, phone, or our website.

Class cancellations by students must be communicated at least 24 hours in advance for private lessons. Late cancellations or no-shows for private lessons will be charged in full.`,
    body_es: `El Estudio se reserva el derecho de cancelar, reprogramar o modificar clases debido a baja inscripción, indisponibilidad del instructor, días festivos, mal tiempo u otras circunstancias fuera de nuestro control. Haremos esfuerzos razonables para notificar a los estudiantes inscritos sobre los cambios por correo electrónico, teléfono o nuestro sitio web.

Las cancelaciones de clases por parte de los estudiantes deben comunicarse con al menos 24 horas de anticipación para las lecciones privadas. Las cancelaciones tardías o ausencias en lecciones privadas se cobrarán en su totalidad.`,
  },
  {
    heading: '5. Physical Activity & Assumption of Risk',
    heading_es: '5. Actividad Física y Asunción de Riesgos',
    body: `Dance and physical exercise involve inherent risks of injury, including but not limited to muscle strains, sprains, falls, and cardiovascular events. By enrolling, you voluntarily assume all risks associated with participation in dance classes and related activities.

You represent that you (or your child, if enrolling a minor) are in good health and physically fit to participate in the enrolled program. You agree to inform the Studio of any medical conditions, injuries, or physical limitations that may affect participation. The Studio reserves the right to require a physician's clearance before allowing participation.

To the fullest extent permitted by New Jersey law, you release and hold harmless ${STUDIO_NAME}, its owners, instructors, employees, and agents from any and all claims, demands, losses, or damages arising out of or related to participation in Studio activities, including injury or death, except where caused by the Studio's gross negligence or willful misconduct.`,
    body_es: `El baile y el ejercicio físico conllevan riesgos inherentes de lesiones, incluyendo pero no limitado a distensiones musculares, esguinces, caídas y eventos cardiovasculares. Al inscribirse, usted asume voluntariamente todos los riesgos asociados con la participación en clases de baile y actividades relacionadas.

Usted declara que usted (o su hijo/a, si inscribe a un menor) goza de buena salud y condición física para participar en el programa inscrito. Acepta informar al Estudio sobre cualquier condición médica, lesión o limitación física que pueda afectar la participación. El Estudio se reserva el derecho de requerir autorización médica antes de permitir la participación.

En la máxima medida permitida por la ley de Nueva Jersey, usted libera y exime de responsabilidad a ${STUDIO_NAME}, sus propietarios, instructores, empleados y agentes de cualquier reclamación, demanda, pérdida o daño que surja de o esté relacionado con la participación en las actividades del Estudio, incluyendo lesiones o muerte, excepto cuando sean causados por negligencia grave o conducta dolosa del Estudio.`,
  },
  {
    heading: '6. Code of Conduct',
    heading_es: '6. Código de Conducta',
    body: `All students, parents, and guests are expected to conduct themselves respectfully toward instructors, staff, and fellow students. The Studio does not tolerate harassment, discrimination, bullying, or any conduct that disrupts the learning environment.

Violations of this code of conduct may result in immediate removal from class without refund and permanent ban from the Studio at the Studio's sole discretion. Conduct that violates applicable law will be reported to the appropriate authorities.

Students are expected to arrive on time, wear appropriate attire (including proper dance footwear when required), and follow all instructor directions for safety and class management.`,
    body_es: `Se espera que todos los estudiantes, padres y visitantes se comporten con respeto hacia los instructores, el personal y los demás estudiantes. El Estudio no tolera el acoso, la discriminación, el bullying ni ninguna conducta que interrumpa el ambiente de aprendizaje.

Las violaciones de este código de conducta pueden resultar en expulsión inmediata de la clase sin reembolso y prohibición permanente del Estudio a discreción exclusiva del Estudio. Las conductas que violen la ley aplicable serán reportadas a las autoridades correspondientes.

Se espera que los estudiantes lleguen a tiempo, usen vestimenta apropiada (incluyendo calzado de baile adecuado cuando sea necesario) y sigan todas las instrucciones del instructor por razones de seguridad y gestión de clases.`,
  },
  {
    heading: '7. Photography, Video & Media Release',
    heading_es: '7. Autorización de Fotografía, Video y Medios',
    body: `The Studio may photograph or video record classes, performances, recitals, and events for promotional, educational, and archival purposes. By enrolling, you grant ${STUDIO_NAME} a perpetual, royalty-free, worldwide license to use your (or your child's) name, likeness, voice, and image in photographs, videos, and other media for marketing, social media, website, and promotional materials.

If you do not wish to be photographed or filmed, you must notify the Studio in writing prior to enrollment. The Studio will make reasonable efforts to accommodate opt-out requests, but cannot guarantee exclusion from group recordings or live-performance footage.`,
    body_es: `El Estudio puede fotografiar o grabar en video clases, presentaciones, recitales y eventos con fines promocionales, educativos y de archivo. Al inscribirse, usted otorga a ${STUDIO_NAME} una licencia perpetua, libre de regalías y mundial para usar su nombre (o el de su hijo/a), imagen, voz y apariencia en fotografías, videos y otros medios para marketing, redes sociales, sitio web y materiales promocionales.

Si no desea ser fotografiado o filmado, debe notificar al Estudio por escrito antes de la inscripción. El Estudio hará esfuerzos razonables para atender las solicitudes de exclusión, pero no puede garantizar la exclusión de grabaciones grupales o de presentaciones en vivo.`,
  },
  {
    heading: '8. Intellectual Property',
    heading_es: '8. Propiedad Intelectual',
    body: `All choreography, class content, instructional materials, music selections, and branding created or curated by ${STUDIO_NAME} are the intellectual property of the Studio or its licensors. You may not reproduce, distribute, publicly perform, or create derivative works from Studio content without prior written permission.

The Studio's name, logo, and trade dress are protected trademarks. Use of the Studio's intellectual property without authorization is strictly prohibited.`,
    body_es: `Toda la coreografía, el contenido de las clases, los materiales de instrucción, las selecciones musicales y la marca creados o seleccionados por ${STUDIO_NAME} son propiedad intelectual del Estudio o sus licenciantes. No puede reproducir, distribuir, ejecutar públicamente ni crear obras derivadas del contenido del Estudio sin permiso previo por escrito.

El nombre, logotipo y apariencia comercial del Estudio son marcas registradas protegidas. El uso no autorizado de la propiedad intelectual del Estudio está estrictamente prohibido.`,
  },
  {
    heading: '9. Website Use',
    heading_es: '9. Uso del Sitio Web',
    body: `You may use our website for lawful purposes only. You agree not to:

• Use the website in any way that violates applicable local, state, national, or international law
• Transmit any unsolicited advertising or "spam"
• Attempt to gain unauthorized access to any part of the website or its related systems
• Use automated tools (bots, scrapers) to access or collect data from the website without our written consent

The Studio reserves the right to modify, suspend, or discontinue the website at any time without notice.`,
    body_es: `Puede usar nuestro sitio web solo para fines legales. Usted acepta no:

• Usar el sitio web de ninguna manera que viole la ley local, estatal, nacional o internacional aplicable
• Transmitir publicidad no solicitada o "spam"
• Intentar obtener acceso no autorizado a cualquier parte del sitio web o sus sistemas relacionados
• Utilizar herramientas automatizadas (bots, scrapers) para acceder o recopilar datos del sitio web sin nuestro consentimiento escrito

El Estudio se reserva el derecho de modificar, suspender o descontinuar el sitio web en cualquier momento sin previo aviso.`,
  },
  {
    heading: '10. Limitation of Liability',
    heading_es: '10. Limitación de Responsabilidad',
    body: `To the maximum extent permitted by New Jersey law, ${STUDIO_NAME} and its owners, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of revenue, loss of data, or loss of goodwill — arising out of or related to your use of our services or website, even if we have been advised of the possibility of such damages.

Our total liability for any claim arising from these Terms or your use of our services shall not exceed the total fees paid by you to the Studio in the three (3) months preceding the event giving rise to the claim.`,
    body_es: `En la máxima medida permitida por la ley de Nueva Jersey, ${STUDIO_NAME} y sus propietarios, directivos, empleados y agentes no serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo — incluyendo pero no limitado a pérdida de ingresos, pérdida de datos o pérdida de reputación — que surja de o esté relacionado con el uso de nuestros servicios o sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños.

Nuestra responsabilidad total por cualquier reclamación que surja de estos Términos o del uso de nuestros servicios no superará las tarifas totales pagadas por usted al Estudio en los tres (3) meses anteriores al evento que dio origen a la reclamación.`,
  },
  {
    heading: '11. Indemnification',
    heading_es: '11. Indemnización',
    body: `You agree to defend, indemnify, and hold harmless ${STUDIO_NAME} and its owners, employees, instructors, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your breach of these Terms, your violation of any law or the rights of a third party, or your participation in Studio activities.`,
    body_es: `Usted acepta defender, indemnizar y eximir de responsabilidad a ${STUDIO_NAME} y sus propietarios, empleados, instructores y agentes de y contra cualquier reclamación, responsabilidad, daño, pérdida y gasto (incluidos honorarios razonables de abogados) que surjan de o estén relacionados de cualquier manera con su incumplimiento de estos Términos, su violación de cualquier ley o los derechos de un tercero, o su participación en las actividades del Estudio.`,
  },
  {
    heading: '12. Governing Law & Dispute Resolution',
    heading_es: '12. Ley Aplicable y Resolución de Disputas',
    body: `These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict-of-law provisions.

Any dispute arising from or related to these Terms or your use of our services shall first be addressed by good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in Union County, New Jersey, in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction. The New Jersey Consumer Fraud Act and other applicable consumer protection statutes are not waived by this clause.

If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.`,
    body_es: `Estos Términos se rigen por las leyes del Estado de Nueva Jersey, Estados Unidos, sin tener en cuenta sus disposiciones sobre conflicto de leyes.

Cualquier disputa que surja de o esté relacionada con estos Términos o el uso de nuestros servicios se abordará primero mediante negociación de buena fe. Si no se resuelve, las disputas se someterán a arbitraje vinculante en el Condado de Union, Nueva Jersey, de acuerdo con las reglas de la Asociación Americana de Arbitraje, excepto que cualquiera de las partes puede solicitar medidas cautelares ante un tribunal de jurisdicción competente. La Ley de Fraude al Consumidor de Nueva Jersey y otros estatutos de protección al consumidor aplicables no se renuncian mediante esta cláusula.

Si alguna disposición de estos Términos resulta inaplicable, las disposiciones restantes permanecerán en plena vigencia.`,
  },
  {
    heading: '13. Changes to These Terms',
    heading_es: '13. Cambios a Estos Términos',
    body: `The Studio reserves the right to update or modify these Terms at any time. Material changes will be communicated by updating the effective date on this page and, where appropriate, notifying active students by email. Your continued use of our services after any changes constitutes acceptance of the updated Terms.`,
    body_es: `El Estudio se reserva el derecho de actualizar o modificar estos Términos en cualquier momento. Los cambios materiales se comunicarán actualizando la fecha de vigencia en esta página y, cuando corresponda, notificando a los estudiantes activos por correo electrónico. El uso continuo de nuestros servicios después de cualquier cambio constituye la aceptación de los Términos actualizados.`,
  },
  {
    heading: '14. Contact Us',
    heading_es: '14. Contáctenos',
    body: `For questions about these Terms of Service, please contact us:

${STUDIO_NAME}
${STUDIO_ADDRESS}
Phone: ${STUDIO_PHONE}
Email: ${STUDIO_EMAIL}`,
    body_es: `Para preguntas sobre estos Términos de Servicio, contáctenos:

${STUDIO_NAME}
${STUDIO_ADDRESS}
Teléfono: ${STUDIO_PHONE}
Correo electrónico: ${STUDIO_EMAIL}`,
  },
];

export function TermsOfServicePage() {
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
            {isEs ? 'Términos de Servicio' : 'Terms of Service'}
          </h1>
          <p className="text-text-muted text-sm">
            {isEs ? `Fecha de vigencia: ${EFFECTIVE_DATE}` : `Effective Date: ${EFFECTIVE_DATE}`}
          </p>
          <p className="text-text mt-6 leading-relaxed">
            {isEs
              ? `Estos Términos de Servicio ("Términos") constituyen un acuerdo legalmente vinculante entre usted y ${STUDIO_NAME} ("el Estudio"). Por favor léalos detenidamente antes de utilizar nuestros servicios.`
              : `These Terms of Service ("Terms") constitute a legally binding agreement between you and ${STUDIO_NAME} ("the Studio"). Please read them carefully before using our services.`
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
