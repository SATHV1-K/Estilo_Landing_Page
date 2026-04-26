-- ═══════════════════════════════════════════════════════════════════════════════
-- Estilo Latino Dance Company — Database Seed
-- Run via: Supabase Dashboard → SQL Editor → New Query → paste → Run
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Dance Styles ─────────────────────────────────────────────────────────────

INSERT INTO dance_styles (id, slug, name, name_es, tagline, description, description_es, hero_image, card_image, age_group, sort_order, is_active, contact_only) VALUES
('1', 'salsa-on1', 'Salsa On1', 'Salsa On1', 'ADULTS',
  'Master the classic New York-style Salsa On1 timing. From beginner footwork to advanced shines and partnerwork, build your foundation on one of the most popular Latin dance rhythms.',
  'Domina la Salsa estilo Nueva York en tiempo On1. Desde los pasos básicos hasta shines y trabajo en pareja avanzado, construye tu base en uno de los ritmos latinos más populares.',
  '/images/salsa-hero.jpg', '/images/salsa-card.jpg', 'adults', 1, TRUE, FALSE),
('2', 'salsa-calena', 'Salsa Caleña', 'Salsa Caleña', 'ADULTS',
  'Experience the explosive footwork and vibrant energy of Salsa Caleña from Cali, Colombia. Known for its rapid foot patterns and joyful style, it is one of the most exciting Salsa variations.',
  'Experimenta el trabajo de pies explosivo y la energía vibrante de la Salsa Caleña de Cali, Colombia. Conocida por sus patrones de pies rápidos y estilo alegre, es una de las variaciones de Salsa más emocionantes.',
  '/images/salsa-hero.jpg', '/images/salsa-card.jpg', 'adults', 2, TRUE, FALSE),
('3', 'bachata', 'Bachata', 'Bachata', 'ADULTS',
  'Experience the sensual and romantic dance of Bachata. Learn traditional and modern styles in our welcoming classes.',
  'Experimenta el baile sensual y romántico de la Bachata. Aprende estilos tradicionales y modernos en nuestras clases acogedoras.',
  '/images/bachata-hero.jpg', '/images/bachata-card.jpg', 'adults', 3, TRUE, FALSE),
('4', 'urban-hiphop', 'Urban / HipHop', 'Urbano / HipHop', 'ADULTS',
  'Hip Hop, Reggaeton, and urban styles. Express yourself through high-energy movement with creativity and authentic street-dance technique.',
  'Hip Hop, Reggaeton y estilos urbanos. Exprésate a través del movimiento de alta energía con creatividad y técnica auténtica de baile callejero.',
  '/images/street-hero.jpg', '/images/street-card.jpg', 'adults', 4, TRUE, FALSE),
('5', 'latin-rhythms-kids', 'Latin Rhythms Kids', 'Ritmos Latinos para Niños', 'KIDS',
  'Fun and energetic Latin dance classes for children. Learn Salsa, Merengue, and more while building confidence and coordination.',
  'Clases de baile latino divertidas y enérgicas para niños. Aprende Salsa, Merengue y más mientras desarrollas confianza y coordinación.',
  '/images/kids-latin-hero.jpg', '/images/kids-latin-card.jpg', 'kids', 5, TRUE, FALSE),
('6', 'weddings-first-dance', 'Weddings / First Dance', 'Bodas / Primer Baile', 'SPECIAL EVENT',
  'Your first dance should be perfect. We create a personalized routine that matches your style, your song, and your skill level. Packages are custom — call us to find out more.',
  'Tu primer baile debe ser perfecto. Creamos una rutina personalizada que se adapta a tu estilo, tu canción y tu nivel. Los paquetes son a medida — llámanos para más información.',
  '/images/wedding-hero.jpg', '/images/wedding-hero.jpg', 'all', 6, TRUE, TRUE),
('7', 'sweet-16-15', 'Sweet 16 / 15', 'Sweet 16 / Quinceañera', 'SPECIAL EVENT',
  'Make your quinceañera or Sweet 16 unforgettable with a custom choreographed dance for you and your court. Packages are custom — call us to find out more.',
  'Haz tu quinceañera o Sweet 16 inolvidable con una coreografía personalizada para ti y tu corte. Los paquetes son a medida — llámanos para más información.',
  '/images/sweet-sixteen-hero.jpg', '/images/sweet-sixteen-hero.jpg', 'all', 7, TRUE, TRUE),
('8', 'one-on-one-privates', 'One on One Privates', 'Clases Privadas', 'ONE-ON-ONE',
  'Personalized private instruction tailored entirely to your goals. Whether you are preparing for an event, mastering technique, or just want focused attention — call us to schedule.',
  'Instrucción privada personalizada completamente adaptada a tus objetivos. Ya sea preparándote para un evento, dominando la técnica o simplemente queriendo atención enfocada — llámanos para programar.',
  '/images/private-hero.jpg', '/images/private-card.jpg', 'all', 8, TRUE, TRUE),
('9', 'corporate-events', 'Corporate Events', 'Eventos Corporativos', 'CORPORATE',
  'Bring the energy of Latin dance to your next corporate event, team-building activity, or company celebration. Packages are custom — call us to find out more.',
  'Lleva la energía del baile latino a tu próximo evento corporativo, actividad de equipo o celebración empresarial. Los paquetes son a medida — llámanos para más información.',
  '/images/salsa-hero.jpg', '/images/salsa-card.jpg', 'all', 9, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Instructors ──────────────────────────────────────────────────────────────

INSERT INTO instructors (id, name, specialty, bio, bio_es, photo_url, social_links, sort_order, is_active) VALUES
('1', 'Maria Rodriguez', 'Salsa & Bachata',
  'World Salsa Champion with over 15 years of teaching experience. Maria brings authentic Latin passion to every class.',
  'Campeona Mundial de Salsa con más de 15 años de experiencia enseñando. María trae pasión latina auténtica a cada clase.',
  '/images/instructor-1.jpg',
  '[{"platform":"instagram","url":"https://instagram.com/mariasalsa"}]',
  1, TRUE),
('2', 'Carlos Mendez', 'Street Dance',
  'Professional choreographer specializing in Hip Hop, Reggaeton, and Afrobeat. Carlos has trained dancers for major productions.',
  'Coreógrafo profesional especializado en Hip Hop, Reggaeton y Afrobeat. Carlos ha entrenado bailarines para grandes producciones.',
  '/images/instructor-2.jpg',
  '[{"platform":"instagram","url":"https://instagram.com/carlosdance"}]',
  2, TRUE),
('3', 'Sofia Garcia', 'Ballet',
  'Certified ballet instructor with a passion for teaching children. Sofia creates a nurturing environment for young dancers.',
  'Instructora de ballet certificada con pasión por enseñar a niños. Sofía crea un ambiente acogedor para bailarines jóvenes.',
  '/images/instructor-3.jpg',
  '[]',
  3, TRUE),
('4', 'Juan Torres', 'Contemporary',
  'Contemporary dance artist and choreographer. Juan blends traditional and modern techniques for unique performances.',
  'Artista de danza contemporánea y coreógrafo. Juan mezcla técnicas tradicionales y modernas para actuaciones únicas.',
  '/images/instructor-4.jpg',
  '[{"platform":"instagram","url":"https://instagram.com/juantorres"}]',
  4, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Recurring Schedule ───────────────────────────────────────────────────────

INSERT INTO recurring_schedule (id, day_of_week, start_time, end_time, class_name, detail, category, location, is_active, sort_order) VALUES
('rec-01', 'monday',    '18:00', '19:00', 'Kids Latin Rhythms',           'Intermediate | 5 Years Old and Up',                                                       'kids',    'Main Studio', TRUE,  1),
('rec-02', 'monday',    '19:00', '20:00', 'Salsa Foundamental',            'Totally Beginners',                                                                        'salsa',   'Main Studio', TRUE,  2),
('rec-03', 'monday',    '20:00', '21:00', 'Salsa On 1',                   'Shines & Partnerwork — Intermediate',                                                      'salsa',   'Main Studio', TRUE,  3),
('rec-04', 'tuesday',   '17:00', '18:00', 'Kids Latin Rhythms',           'Advanced | 5 Years Old and Up',                                                            'kids',    'Main Studio', TRUE,  4),
('rec-05', 'tuesday',   '18:00', '19:00', 'Kids Latin Rhythms',           'Beginners | 5 Years Old and Up',                                                           'kids',    'Main Studio', TRUE,  5),
('rec-06', 'tuesday',   '19:00', '20:00', 'Street Dance',                 'Urban | Hip Hop | Reggaeton | Dancehall — Beginners · 10 Yrs Old and Up',                  'street',  'Main Studio', TRUE,  6),
('rec-07', 'tuesday',   '20:00', '21:00', 'Salsa Caleña',                 'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE,  7),
('rec-08', 'tuesday',   '21:00', '22:00', 'Euphoria Dance Team',          '',                                                                                         'team',    'Main Studio', TRUE,  8),
('rec-09', 'wednesday', '17:00', '18:00', 'Gymnastics Workshop',          '',                                                                                         'special', 'Main Studio', TRUE,  9),
('rec-10', 'wednesday', '18:00', '19:00', 'Kids Latin Rhythms',           'Intermediate | 5 Years Old and Up',                                                       'kids',    'Main Studio', TRUE, 10),
('rec-11', 'wednesday', '19:00', '20:00', 'Salsa Foundamental',            'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE, 11),
('rec-12', 'wednesday', '20:00', '21:00', 'Bachata',                      'Beginners - Social — Open Level',                                                          'bachata', 'Main Studio', TRUE, 12),
('rec-13', 'wednesday', '21:00', '22:00', 'Bachata',                      'Intermediate Choreography',                                                                'bachata', 'Main Studio', TRUE, 13),
('rec-14', 'thursday',  '17:00', '18:00', 'Kids Latin Rhythms',           'Advanced | 5 Years Old and Up',                                                            'kids',    'Main Studio', TRUE, 14),
('rec-15', 'thursday',  '18:00', '19:00', 'Kids Latin Rhythms',           'Beginners | 5 Years Old and Up',                                                           'kids',    'Main Studio', TRUE, 15),
('rec-16', 'thursday',  '19:00', '20:00', 'Salsa Caleña',                 'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE, 16),
('rec-17', 'thursday',  '20:00', '21:00', 'Salsa Caleña',                 'Intermediate Choreography',                                                                'salsa',   'Main Studio', TRUE, 17),
('rec-18', 'thursday',  '21:00', '22:00', 'Euphoria Dance Team',          '',                                                                                         'team',    'Main Studio', TRUE, 18),
('rec-19', 'friday',    '17:00', '18:00', 'Contemporary Ballet Workshop', '',                                                                                         'ballet',  'Main Studio', TRUE, 19),
('rec-20', 'friday',    '18:00', '19:00', 'Street Dance Dance Team',      '10 Yrs Old and Up',                                                                        'street',  'Main Studio', TRUE, 20),
('rec-21', 'friday',    '19:00', '20:00', 'Street Dance',                 'Urban | Hip Hop | Reggaeton | Dancehall — 10 Yrs Old and Up',                              'street',  'Main Studio', TRUE, 21),
('rec-22', 'friday',    '20:00', '21:00', 'Salsa On 1',                   'Shines & Partnerwork — Intermediate - Choreography',                                       'salsa',   'Main Studio', TRUE, 22),
('rec-23', 'saturday',  '10:00', '14:00', 'Private Lessons',              'By Appointment: 10AM, 11AM, 12PM, 1PM, 2PM',                                               'special', 'Main Studio', TRUE, 23)
ON CONFLICT (id) DO NOTHING;

-- ─── Overview Schedule (mirrors recurring) ────────────────────────────────────

INSERT INTO overview_schedule (id, day_of_week, start_time, end_time, class_name, detail, category, location, is_active, sort_order) VALUES
('ovw-01', 'monday',    '18:00', '19:00', 'Kids Latin Rhythms',           'Intermediate | 5 Years Old and Up',                                                       'kids',    'Main Studio', TRUE,  1),
('ovw-02', 'monday',    '19:00', '20:00', 'Salsa Foundamental',            'Totally Beginners',                                                                        'salsa',   'Main Studio', TRUE,  2),
('ovw-03', 'monday',    '20:00', '21:00', 'Salsa On 1',                   'Shines & Partnerwork — Intermediate',                                                      'salsa',   'Main Studio', TRUE,  3),
('ovw-04', 'tuesday',   '17:00', '18:00', 'Kids Latin Rhythms',           'Advanced | 5 Years Old and Up',                                                            'kids',    'Main Studio', TRUE,  4),
('ovw-05', 'tuesday',   '18:00', '19:00', 'Kids Latin Rhythms',           'Beginners | 5 Years Old and Up',                                                           'kids',    'Main Studio', TRUE,  5),
('ovw-06', 'tuesday',   '19:00', '20:00', 'Street Dance',                 'Urban | Hip Hop | Reggaeton | Dancehall — Beginners · 10 Yrs Old and Up',                  'street',  'Main Studio', TRUE,  6),
('ovw-07', 'tuesday',   '20:00', '21:00', 'Salsa Caleña',                 'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE,  7),
('ovw-08', 'tuesday',   '21:00', '22:00', 'Euphoria Dance Team',          '',                                                                                         'team',    'Main Studio', TRUE,  8),
('ovw-09', 'wednesday', '17:00', '18:00', 'Gymnastics Workshop',          '',                                                                                         'special', 'Main Studio', TRUE,  9),
('ovw-10', 'wednesday', '18:00', '19:00', 'Kids Latin Rhythms',           'Intermediate | 5 Years Old and Up',                                                       'kids',    'Main Studio', TRUE, 10),
('ovw-11', 'wednesday', '19:00', '20:00', 'Salsa Foundamental',            'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE, 11),
('ovw-12', 'wednesday', '20:00', '21:00', 'Bachata',                      'Beginners - Social — Open Level',                                                          'bachata', 'Main Studio', TRUE, 12),
('ovw-13', 'wednesday', '21:00', '22:00', 'Bachata',                      'Intermediate Choreography',                                                                'bachata', 'Main Studio', TRUE, 13),
('ovw-14', 'thursday',  '17:00', '18:00', 'Kids Latin Rhythms',           'Advanced | 5 Years Old and Up',                                                            'kids',    'Main Studio', TRUE, 14),
('ovw-15', 'thursday',  '18:00', '19:00', 'Kids Latin Rhythms',           'Beginners | 5 Years Old and Up',                                                           'kids',    'Main Studio', TRUE, 15),
('ovw-16', 'thursday',  '19:00', '20:00', 'Salsa Caleña',                 'Beginners - Intermediate',                                                                 'salsa',   'Main Studio', TRUE, 16),
('ovw-17', 'thursday',  '20:00', '21:00', 'Salsa Caleña',                 'Intermediate Choreography',                                                                'salsa',   'Main Studio', TRUE, 17),
('ovw-18', 'thursday',  '21:00', '22:00', 'Euphoria Dance Team',          '',                                                                                         'team',    'Main Studio', TRUE, 18),
('ovw-19', 'friday',    '17:00', '18:00', 'Contemporary Ballet Workshop', '',                                                                                         'ballet',  'Main Studio', TRUE, 19),
('ovw-20', 'friday',    '18:00', '19:00', 'Street Dance Dance Team',      '10 Yrs Old and Up',                                                                        'street',  'Main Studio', TRUE, 20),
('ovw-21', 'friday',    '19:00', '20:00', 'Street Dance',                 'Urban | Hip Hop | Reggaeton | Dancehall — 10 Yrs Old and Up',                              'street',  'Main Studio', TRUE, 21),
('ovw-22', 'friday',    '20:00', '21:00', 'Salsa On 1',                   'Shines & Partnerwork — Intermediate - Choreography',                                       'salsa',   'Main Studio', TRUE, 22),
('ovw-23', 'saturday',  '10:00', '14:00', 'Private Lessons',              'By Appointment: 10AM, 11AM, 12PM, 1PM, 2PM',                                               'special', 'Main Studio', TRUE, 23)
ON CONFLICT (id) DO NOTHING;

-- ─── Packages ─────────────────────────────────────────────────────────────────

INSERT INTO packages (id, name, name_es, category, price, currency, class_count, expiration_months, description, description_es, payment_link, sort_order, is_active) VALUES
('1',  'Single Class',          'Clase Individual',            'adults-salsa-bachata', 2500,  'USD',  1,    NULL, 'Try one class. Perfect for first-timers.',                                                                                                                                        'Prueba una clase. Perfecto para principiantes.',                                                                                                                                     'https://square.link/u/FNs6RSaO?src=sheet',  1, TRUE),
('2',  '4 Classes Card',        'Tarjeta de 4 Clases',         'adults-salsa-bachata', 9500,  'USD',  4,    1,    'Best for weekly dancers. Expires in 1 month.',                                                                                                                                    'Mejor para bailarines semanales. Expira en 1 mes.',                                                                                                                                  'https://square.link/u/zYAZzk20?src=sheet',  2, TRUE),
('3',  '8 Classes Card',        'Tarjeta de 8 Clases',         'adults-salsa-bachata', 15000, 'USD',  8,    1,    'Great value. Twice a week for a month.',                                                                                                                                          'Gran valor. Dos veces por semana durante un mes.',                                                                                                                                   'https://square.link/u/JnmrkHBX?src=sheet',  3, TRUE),
('4',  '12 Classes Card',       'Tarjeta de 12 Clases',        'adults-salsa-bachata', 19500, 'USD',  12,   2,    'Most popular. Maximum flexibility over 2 months.',                                                                                                                                'Más popular. Máxima flexibilidad durante 2 meses.',                                                                                                                                  'https://square.link/u/qjShNEK8?src=sheet',  4, TRUE),
('5',  '15 Classes Card',       'Tarjeta de 15 Clases',        'adults-salsa-bachata', 22500, 'USD',  15,   2,    'Best value. For dedicated dancers.',                                                                                                                                              'Mejor valor. Para bailarines dedicados.',                                                                                                                                            'https://square.link/u/YzANfSzr?src=sheet',  5, TRUE),
('6',  'Kids Latin Rhythms',    'Ritmos Latinos para Niños',   'kids',                 NULL,  'USD',  NULL, NULL, 'Monthly enrollment for kids ages 5-12.',                                                                                                                                          'Inscripción mensual para niños de 5 a 12 años.',                                                                                                                                    'https://square.link/u/9GoE8ILA?src=sheet',  6, TRUE),
('7',  'Urban / HipHop',        'Urbano / HipHop',             'adults-street',        NULL,  'USD',  NULL, NULL, 'Monthly or drop-in rates available.',                                                                                                                                             'Tarifas mensuales o por clase disponibles.',                                                                                                                                         'https://square.link/u/eJjcA1AE?src=sheet',  7, TRUE),
('8',  'Weddings / First Dance', 'Bodas / Primer Baile',        'event',                NULL,  'USD',  NULL, NULL, 'Custom choreography for your special day. Pricing depends on the number of sessions and routine complexity. Call us to get started.',                                             'Coreografía personalizada para tu día especial. El precio depende del número de sesiones y la complejidad de la rutina. Llámanos para comenzar.',                                    '',                                          8, TRUE),
('9',  'Sweet 16 / 15',         'Sweet 16 / Quinceañera',      'event',                NULL,  'USD',  NULL, NULL, 'A fully custom choreography package for you and your court. Call us to find out what is included and get a quote.',                                                               'Un paquete de coreografía completamente personalizado para ti y tu corte. Llámanos para saber qué está incluido y obtener un presupuesto.',                                           '',                                          9, TRUE),
('10', 'One on One Privates',   'Clases Privadas',             'private',              NULL,  'USD',  NULL, NULL, 'Personalized private lessons tailored to your goals and schedule. Rates vary — call us to discuss options.',                                                                      'Clases privadas personalizadas adaptadas a tus objetivos y horario. Las tarifas varían — llámanos para hablar sobre las opciones.',                                                  '',                                         10, TRUE),
('11', 'Corporate Events',      'Eventos Corporativos',        'event',                NULL,  'USD',  NULL, NULL, 'Custom dance experiences for team-building, company parties, and corporate celebrations. Call us for a custom quote.',                                                            'Experiencias de baile personalizadas para team-building, fiestas de empresa y celebraciones corporativas. Llámanos para un presupuesto personalizado.',                              '',                                         11, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Reviews ──────────────────────────────────────────────────────────────────

INSERT INTO reviews (id, name, stars, text, sort_order, is_active) VALUES
('rev-01', 'Maria S.',     5, 'I had the BEST experience working with Estilo Latino Dance Company! Fernando made coordinating the event so easy, and Anthony and Arianna were such wonderful teachers and performers.',  1, TRUE),
('rev-02', 'Eric D.',      5, 'The studio''s environment is a great place to learn and meet new people. Quality service both on and off the dance floor. This was and is my home since 2012, which molded my dance career.',  2, TRUE),
('rev-03', 'Jennifer L.',  5, 'I signed my 9-year-old daughter up for hip-hop and ballet and she absolutely loves it! The teachers take their time with her and make sure she fits in. Classes are very affordable!',  3, TRUE),
('rev-04', 'Carlos M.',    5, 'Recomendado Full. Encontramos este lugar para la coreografía de nuestra boda. Gracias al profesionalismo de Fernando y su equipo pudimos hacerlo realidad. Ya estamos planeando volver.',  4, TRUE),
('rev-05', 'David R.',     5, 'Very cool place. The instructors really make an effort to make sure each student is picking up the concepts. I will definitely be back.',  5, TRUE),
('rev-06', 'Ashley T.',    5, 'My 3 girls went there, not only did they learn to dance but they gained an amazing passion for dance. It was like our family, our dance family. Great school!',  6, TRUE),
('rev-07', 'Michael P.',   5, 'I have been going to Estilo Latino for Salsa and Bachata lessons for a few months now, and the new agility learned, the acquired confidence definitely show on the dance floor.',  7, TRUE),
('rev-08', 'Sandra G.',    5, 'Fernando is such an amazing instructor! He is very knowledgeable and makes us feel so comfortable during our learning process. The studio is so clean and a wonderful space.',  8, TRUE),
('rev-09', 'Luis H.',      5, 'A non-pressure social setting for people of all levels, especially beginner students who are excited to learn and benefit from the art of dance. Highly recommend.',  9, TRUE),
('rev-10', 'Rachel K.',    5, 'The students, families, and staff all had so much fun learning salsa and bachata, and the professional performance at the end was the perfect finale! Absolutely recommend!', 10, TRUE),
('rev-11', 'Daniel F.',    5, 'Estilo Latino gave my kids the tools to build a career from their passion to dance. Multiple world dance champions have come from this studio. Incredible place.', 11, TRUE),
('rev-12', 'Patricia V.',  5, 'Don''t be afraid to come and check it out, everyone''s welcome! The teachers are very nice and work hard with the students. My daughter has special needs and they were amazing with her.', 12, TRUE),
('rev-13', 'James W.',     5, 'Offering a great environment to learn Latin dances. Fernando and the team are passionate and dedicated. Best salsa school in Elizabeth, hands down.', 13, TRUE),
('rev-14', 'Ana R.',       5, 'Las clases son increíbles, los instructores son muy pacientes y profesionales. Mi familia y yo nos sentimos como en casa desde el primer día.', 14, TRUE),
('rev-15', 'Kevin B.',     5, 'Started as a total beginner and within months I was confidently dancing at social events. The structured curriculum and supportive instructors made all the difference.', 15, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ─── Alerts ───────────────────────────────────────────────────────────────────

INSERT INTO alerts (id, title, title_es, message, message_es, type, link, link_label, is_active, sort_order) VALUES
('alert-1',
  'First Class FREE for New Students!',
  '¡Primera Clase GRATIS para Nuevos Estudiantes!',
  'New classes are starting soon. Come try salsa, bachata, or cumbia — your first class is completely free. No experience needed.',
  'Las nuevas clases están comenzando pronto. Ven a probar salsa, bachata o cumbia — tu primera clase es completamente gratis. No se necesita experiencia.',
  'promo', '/packages', 'See Packages', TRUE, 1)
ON CONFLICT (id) DO NOTHING;

-- ─── Site Settings (singleton) ────────────────────────────────────────────────

INSERT INTO site_settings (id, studio_name, studio_name_short, tagline, address, address_line2, city, state, zip, phone, whatsapp, email, google_maps_embed, social_links, business_hours, meta_title, meta_description, footer_text) VALUES
('singleton',
  'Estilo Latino Dance Company',
  'Estilo Latino',
  'Dance Academy',
  '345 Morris Ave Ste 1B',
  '',
  'Elizabeth',
  'NJ',
  '07208',
  '+1 (201) 878-8977',
  '+12018788977',
  'info@EstiloLatinoDance.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.8!2d-74.2107!3d40.6644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM5JzUxLjgiTiA3NMKwMTInMzguNSJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
  '[{"platform":"Facebook","url":"https://facebook.com/EstiloLatinoDC","label":"EstiloLatinoDC"},{"platform":"Instagram","url":"https://instagram.com/estilo.latino","label":"@estilo.latino"},{"platform":"TikTok","url":"https://tiktok.com/@estilolatino","label":"@estilolatino"},{"platform":"YouTube","url":"https://youtube.com/@estilolatino","label":"Estilo Latino"}]',
  '[{"day":"Monday","open":"18:00","close":"22:00","isClosed":false},{"day":"Tuesday","open":"18:00","close":"22:00","isClosed":false},{"day":"Wednesday","open":"18:00","close":"22:00","isClosed":false},{"day":"Thursday","open":"18:00","close":"22:00","isClosed":false},{"day":"Friday","open":"18:00","close":"22:00","isClosed":false},{"day":"Saturday","open":"10:00","close":"14:00","isClosed":false},{"day":"Sunday","open":"","close":"","isClosed":true}]',
  'Estilo Latino Dance Company | Elizabeth, NJ',
  'Salsa, Bachata, Ballet, Street Dance classes in Elizabeth, NJ',
  '')
ON CONFLICT (id) DO NOTHING;

-- ─── Site Content ─────────────────────────────────────────────────────────────

INSERT INTO site_content (key, value) VALUES
('home.hero.headline',           'ESTILO LATINO'),
('home.hero.headline_es',        'ESTILO LATINO'),
('home.hero.subheadline',        'LIVE & ON-DEMAND DANCE CLASSES FOR ALL LEVELS'),
('home.hero.subheadline_es',     'CLASES DE BAILE EN VIVO Y BAJO DEMANDA PARA TODOS LOS NIVELES'),
('home.hero.cta_label',          'FREE CLASS'),
('home.hero.cta_label_es',       'CLASE GRATIS'),
('home.hero.cta_link',           '/contact'),
('home.marquee.text',            'BAILA ★ DANCE ★ SALSA ★ BACHATA ★ KIDS ★ URBAN ★'),
('home.styles.heading',          'STYLES'),
('home.styles.heading_es',       'ESTILOS'),
('home.styles.subheading',       'MASTER THE MOVES THAT MOVE YOU'),
('home.styles.subheading_es',    'DOMINA LOS MOVIMIENTOS QUE TE EMOCIONAN'),
('home.instructors.heading',     'MEET THE TEAM'),
('home.instructors.heading_es',  'CONOCE AL EQUIPO'),
('home.cta_banner.heading',      'READY TO DANCE?'),
('home.cta_banner.heading_es',   '¿LISTO PARA BAILAR?'),
('home.cta_banner.body',         'Join us for a free trial class. No experience needed.'),
('home.cta_banner.body_es',      'Únete a nosotros para una clase de prueba gratis. No se necesita experiencia.'),
('home.cta_banner.cta_label',    'CLAIM YOUR FREE CLASS'),
('home.cta_banner.cta_label_es', 'RECLAMAR MI CLASE GRATIS'),
('home.cta_banner.cta_link',     '/contact'),
('about.heading',                'OUR STORY'),
('about.heading_es',             'NUESTRA HISTORIA'),
('about.body',                   'Founded in the heart of the community, Estilo Latino Dance Company has been bringing the joy of Latin dance to students of all ages and backgrounds. Our mission is to share culture, build confidence, and create community through movement.'),
('about.body_es',                'Fundada en el corazón de la comunidad, Estilo Latino Dance Company ha estado llevando la alegría del baile latino a estudiantes de todas las edades y orígenes. Nuestra misión es compartir cultura, construir confianza y crear comunidad a través del movimiento.'),
('about.mission',                'To make world-class Latin dance education accessible to everyone.'),
('about.mission_es',             'Hacer que la educación de baile latino de clase mundial sea accesible para todos.'),
('contact.heading',              'GET IN TOUCH'),
('contact.heading_es',           'CONTÁCTANOS'),
('contact.subheading',           'Questions? Ready to start? We''d love to hear from you.'),
('contact.subheading_es',        '¿Preguntas? ¿Listo para empezar? Nos encantaría saber de ti.'),
('packages.heading',             'CLASS PACKAGES'),
('packages.heading_es',          'PAQUETES DE CLASES'),
('packages.subheading',          'FLEXIBLE OPTIONS FOR EVERY DANCER'),
('packages.subheading_es',       'OPCIONES FLEXIBLES PARA CADA BAILARÍN'),
('schedule.heading',             'CLASS SCHEDULE'),
('schedule.heading_es',          'HORARIO DE CLASES'),
('styles.heading',               'DANCE STYLES'),
('styles.heading_es',            'ESTILOS DE BAILE'),
('styles.subheading',            'FIND YOUR RHYTHM'),
('styles.subheading_es',         'ENCUENTRA TU RITMO')
ON CONFLICT (key) DO NOTHING;
