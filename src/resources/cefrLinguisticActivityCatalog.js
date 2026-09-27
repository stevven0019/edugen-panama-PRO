// EDUGEN PANAMA • CEFR LINGUISTIC COMPETENCE ACTIVITY CATALOG
// Referencia Oficial: Table 1. Linguistic Competence Across CEFR Levels (MEDUCA Panamá / AOA Framework)
// Macro-Habilidades: Listening, Reading, Speaking, Writing & Mediation (21st Century Skills: Theme 1 & Theme 2)

export const CEFR_LINGUISTIC_GROUPS = [
  {
    id: 'foundational_learner',
    name: 'Foundational Learner',
    cefrLevel: 'Pre A1',
    badgeColor: '#D97706',
    bgColor: '#FEF3C7',
    clusters: [
      {
        subBandId: 'pre_a1_early',
        gradesLabel: 'Pre-K (Pre A1.1) & Kinder (Pre A1.2)',
        cefrCode: 'Pre A1.1 – Pre A1.2',
        focus: 'Building a foundation in English sounds, letters, and basic vocabulary.',
        keyConsiderations: 'Play-based learning, sensory activities, visual aids, total physical response (TPR), labeling, and modeling.',
        linguisticComponents: 'Primarily phonology (sound awareness), with the beginnings of letter recognition (orthography) and basic vocabulary (semantics).',
        skills: {
          listening: {
            title: 'Sound Detective & Musical Statues (TPR)',
            type: 'Lúdica & Concreta',
            materials: 'Objetos reales de aula (book, ball, desk, crayon), pandero o tambor, flashcards de gran formato.',
            description: 'El docente marca ritmos y reproduce sonidos fonéticos específicos (/s/ snake hiss, /b/ bounce). Cuando el ritmo se detiene de golpe, el docente da la orden: "Touch the yellow pencil!" o "Touch your chair!". Los niños se desplazan kinestésicamente imitando el sonido/animal y tocan con seguridad el objeto real señalado.',
            evidence: 'Respuesta física inmediata y no verbal que demuestra discriminación auditiva y reconocimiento del vocabulario sin necesidad de producción oral forzada.',
            adaptation: 'Ofrecer apoyo de modelado entre pares y limitar la elección a 2 objetos cercanos para estudiantes tímidos.'
          },
          reading: {
            title: 'Sensory Sandpaper & Realia Basket Match',
            type: 'Lúdica & Concreta',
            materials: 'Tarjetas de letras en lija/relieve (A, B, S, M, T), canasta con miniaturas u objetos reales (ball, book, sun, apple).',
            description: 'Los niños pasan el dedo índice sobre la letra texturizada sintiendo el trazo mientras pronuncian su sonido inicial (/b/). Luego buscan en la canasta el juguete real que comienza con dicho fonema y lo colocan dentro de la bandeja correspondiente.',
            evidence: 'Asociación multisensorial del grafema inicial con el fonema y su referente concreto de la vida cotidiana.',
            adaptation: 'Guiar mano sobre mano y utilizar colores contrastantes para niños con baja estimulación visual.'
          },
          speaking: {
            title: 'Magic Box Puppet Echo & Courtesy Turns',
            type: 'Lúdica & Concreta',
            materials: 'Títere amigable ("Sammy the Sloth" o mono tití) y una caja mágica misteriosa.',
            description: 'El títere saca un objeto de la caja con expresión de asombro y pregunta con voz juguetona: "What is this?". Los estudiantes hacen eco coral o individual: "A book!" y luego practican el turno social: "Hello Sammy!", "Thank you!".',
            evidence: 'Producción oral de palabras aisladas de alta frecuencia y uso espontáneo de fórmulas de cortesía básicas con el títere.',
            adaptation: 'Permitir respuesta mediante gestos o señalamiento si el estudiante está en período de silencio natural.'
          },
          writing: {
            title: 'Playdough Letter Sculpt & Water Brush Strokes',
            type: 'Lúdica & Concreta',
            materials: 'Plastilina de colores, plantillas plastificadas con trazos de letras, pinceles con agua y pizarras mágicas.',
            description: 'Los niños amasan "culebritas" de plastilina para formar las líneas de las letras iniciales (I, L, T, O). Luego, con un pincel humedecido en agua sobre pizarra o cartulina oscura, trazan líneas verticales y círculos que representan objetos de su aula.',
            evidence: 'Desarrollo de la pinza motriz fina y reproducción de patrones de pre-escritura y reconocimiento ortográfico inicial.',
            adaptation: 'Proporcionar plastilina más suave o trazos con arena en bandejas de estimulación sensorial.'
          },
          mediation: {
            theme1Project: {
              themeName: 'Theme 1: Classroom Community & Kindness',
              projectTitle: 'Project 1: Classroom Kindness & Routine Mural',
              category: 'Social & Collaborative Mediation',
              overview: 'En parejas, los niños seleccionan tarjetas visuales con íconos de convivencia ("Share toys", "Sit nicely", "Big ears listen") y se ayudan mutuamente a pegarlas en el mural del salón usando velcro, guiando a su compañero mediante sonrisas y gestos de afirmación.',
              centurySkills: 'Colaboración socioemocional, empatía y comunicación no verbal asistida.'
            },
            theme2Project: {
              themeName: 'Theme 2: Sensory Exploration & Problem Solving',
              projectTitle: 'Project 2: Sensory Color & Texture Sorting Challenge',
              category: 'Critical Thinking & Hands-on Exploration',
              overview: 'En pequeños grupos de 3, los estudiantes exploran cajas sensoriales con texturas y resuelven un desafío concreto ("Ayuda al osito triste a encontrar 5 hojas verdes y suaves"). Al finalizar, celebran su logro colocándose una medalla de "Super Helper".',
              centurySkills: 'Resolución de problemas concretos, indagación táctil y autorregulación grupal.'
            }
          }
        }
      },
      {
        subBandId: 'pre_a1_primary',
        gradesLabel: 'Grade 1 (Pre A1.3) & Grade 2 (Pre A1.4)',
        cefrCode: 'Pre A1.3 – Pre A1.4',
        focus: 'Expanding vocabulary, basic grammar, and simple communication.',
        keyConsiderations: 'Visual aids, sentence frames, repetition and practice, corrective feedback, collaborative activities.',
        linguisticComponents: 'Phonology (sound awareness), morphology (basic word formation: plurals with -s), syntax (simple sentence structures: Subject + Verb + Object), and semantics (basic everyday vocabulary).',
        skills: {
          listening: {
            title: 'Action Relay & Color-Shape Plural Bingo',
            type: 'Lúdica & Concreta',
            materials: 'Tableros de bingo ilustrados 3x3, sellos de gomaespuma, tarjetas de sintaxis gráfica.',
            description: 'El docente pronuncia instrucciones orales con estructura gramatical explícita: "The boy touches a red chair" o "Find two pencils". Los estudiantes deben escuchar los modificadores morfosintácticos (color + sustantivo, número + plural en -s) y estampar la casilla correspondiente en su cartón de juego.',
            evidence: 'Discriminación de morfemas de plural (-s) y combinaciones de adjetivo-sustantivo a partir de enunciados orales.',
            adaptation: 'Mostrar la tarjeta visual durante 3 segundos para aquellos estudiantes que necesiten soporte bimodal.'
          },
          reading: {
            title: 'Phonics Hopscotch & Pocket Chart Frame',
            type: 'Lúdica & Concreta',
            materials: 'Tapete de rayuela en el piso con palabras CVC (cat, desk, pen, bag, sun) y atril con sentence strips.',
            description: 'El estudiante salta en la rayuela decodificando la palabra CVC en la que cae. Luego corre hacia el atril y completa la tira de oración insertando la palabra elegida: "[The pen] is [blue]." o "[I see] a [cat].", leyéndola en voz alta con apoyo rítmico de palmas.',
            evidence: 'Decodificación fonética de palabras monosilábicas y lectura guiada de patrones oracionales simples.',
            adaptation: 'Incorporar pictogramas al lado de cada palabra CVC para reforzar la correspondencia grafema-significado.'
          },
          speaking: {
            title: 'Market Basket Realia Role-Play & Polite Frames',
            type: 'Lúdica & Concreta',
            materials: 'Puesto de mercadito escolar con frutas de plástico y útiles escolares; carteles con sentence frames.',
            description: 'En parejas, el Estudiante A es el tendero y el Estudiante B es el comprador. Utilizando un atril con la estructura: "Can I have the [red apple], please?" / "Here you are!" / "Thank you!", realizan intercambios reales entregándose los objetos con entonación amable.',
            evidence: 'Interacción oral de dos turnos utilizando fórmulas comunicativas fijas con correcta entonación pragmática.',
            adaptation: 'Proporcionar tarjetas con imágenes para intercambiar en lugar de depender únicamente del habla.'
          },
          writing: {
            title: 'Color-Coded Sentence Train Builder & Trace',
            type: 'Lúdica & Concreta',
            materials: 'Bloques magnéticos o vagones de cartón de colores (Amarillo = Sujeto, Verde = Verbo, Azul = Objeto).',
            description: 'Los niños unen físicamente los vagones para construir una oración ("I" + "have" + "three books"). Luego copian la oración en sus libretas de doble línea cuidando la separación entre palabras e ilustran el significado debajo.',
            evidence: 'Estructuración sintáctica correcta de oraciones simples afirmativas y control del espaciado interpalabra.',
            adaptation: 'Ofrecer oraciones con líneas punteadas para trazado guiado a estudiantes con retos motrices.'
          },
          mediation: {
            theme1Project: {
              themeName: 'Theme 1: Peer Support & Classroom Empathy',
              projectTitle: 'Project 1: Classroom Helper Buddy Passport',
              category: 'Interpersonal & Instructional Mediation',
              overview: 'Los alumnos trabajan por parejas. Uno de ellos actúa de "guía" ayudando a su compañero a interpretar una instrucción visual del aula (organizar los libros o buscar materiales) señalando y modelando la acción. Al completar la tarea, estampan el pasaporte del compañero.',
              centurySkills: 'Mediación instruccional entre iguales, trabajo en equipo y liderazgo positivo.'
            },
            theme2Project: {
              themeName: 'Theme 2: Daily Life & Narrative Sequences',
              projectTitle: 'Project 2: 3-Step Routine Storyboard & Voice Memo',
              category: 'Digital Storytelling & Critical Sequencing',
              overview: 'En equipos de 3, los estudiantes ordenan cronológicamente 3 tarjetas ilustradas de su rutina diaria ("First I wake up", "Next I go to school", "Then I play"), graban una nota de voz en una tableta escolar con apoyo del docente y presentan su tira gráfica.',
              centurySkills: 'Secuenciación lógica temporal, pensamiento narrativo y uso creativo de TIC.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'beginner',
    name: 'Beginner',
    cefrLevel: 'A1',
    badgeColor: '#0284C7',
    bgColor: '#E0F2FE',
    clusters: [
      {
        subBandId: 'a1_primary_middle',
        gradesLabel: 'Grades 3 (A1.1), 4 (A1.2), 5 (A1.3)',
        cefrCode: 'A1.1, A1.2, A1.3',
        focus: 'Expanding expression and comprehension through vocabulary, grammar, and communication.',
        keyConsiderations: 'Visual aids, graphic organizers, sentence frames, model texts, and peer feedback.',
        linguisticComponents: 'All four components are further developed, with increased emphasis on syntax (moving into compound sentence structures: and, but, because) and semantics (more nuanced vocabulary of places, routines, feelings, and nature).',
        skills: {
          listening: {
            title: 'Information-Gap Barrier Sketch & Setting Detective',
            type: 'Lúdica & Concreta',
            materials: 'Mampara divisoria entre pupitres, pistas de audio o tarjetas descriptivas, hojas de dibujo.',
            description: 'En parejas separadas por una mampara, el Estudiante A escucha una descripción con oraciones compuestas ("The monkey is on the branch and it is eating a yellow banana, but the tiger is sleeping under the tree"). A le transmite los detalles a B para que dibuje la escena con exactitud. Luego retiran la mampara y comparan los 4 detalles clave.',
            evidence: 'Extracción de información específica, preposiciones de lugar y oraciones unidas por conjunciones copulativas y adversativas.',
            adaptation: 'Permitir al estudiante B hacer preguntas de confirmación cerradas ("Is the banana yellow?").'
          },
          reading: {
            title: 'Graphic Organizer Scavenger Hunt & Dialogue Strips',
            type: 'Lúdica & Concreta',
            materials: 'Textos breves ilustrados sobre animales y regiones panameñas (Boquete, Casco Viejo, Darién), diagramas de Venn o tablas T plastificadas, resaltadores de colores.',
            description: 'En tríos, los alumnos leen dos textos breves comparativos y completan un organizador gráfico (diagrama de Venn) extrayendo semejanzas y diferencias mediante el uso de conectores ("both", "and", "but"). Resaltan con verde los hechos y con amarillo los conectores sintácticos.',
            evidence: 'Localización de información explícita y comprensión de relaciones de contraste en textos modelados.',
            adaptation: 'Ofrecer opciones prediseñadas en tiras de papel para pegar en el organizador gráfico.'
          },
          speaking: {
            title: 'Town Board Game & Speed-Interview with Peer Feedback',
            type: 'Lúdica & Concreta',
            materials: 'Tablero ilustrado de la ciudad, dados, fichas, tarjetas con preguntas abiertas, fichas "Two Stars & a Wish".',
            description: 'Los estudiantes avanzan por casillas del tablero ("Market", "Hospital", "School"). Al caer en una casilla deben formular 2 oraciones compuestas usando sentence frames: "I go to the market because I need fresh vegetables, and my sister buys mangoes". El compañero evalúa el turno entregando fichas de retroalimentación formativa ("Two Stars and a Wish").',
            evidence: 'Fluidez oral en intercambios estructurados, uso de conjunciones coordinadas y co-evaluación respetuosa.',
            adaptation: 'Disponer de un banco de conectores visibles en la mesa de juego para consulta inmediata.'
          },
          writing: {
            title: 'Comic Strip Speech Bubble Creator & Postcard Workshop',
            type: 'Lúdica & Concreta',
            materials: 'Plantillas de cómic de 4 viñetas con globos de diálogo vacíos, banco de adjetivos y conectores.',
            description: 'Los estudiantes crean una historieta sobre una aventura escolar o el cuidado de la fauna panameña. Redactan diálogos en los globos empleando conectores compuestos ("We visited the park, but it started to rain, so we went to the museum"). Siguen una lista de cotejo con autocorrección de mayúsculas y puntos.',
            evidence: 'Composición de oraciones compuestas con puntuación adecuada y coherencia narrativa en formato visual.',
            adaptation: 'Permitir recortar y pegar modelos de oraciones con espacios en blanco para completar sustantivos.'
          },
          mediation: {
            theme1Project: {
              themeName: 'Theme 1: Community & Cultural Translation',
              projectTitle: 'Project 1: Interactive Community Tourist Map & Guide',
              category: 'Cultural & Spatial Mediation',
              overview: 'Los equipos diseñan un mapa mural tridimensional de su comunidad con lugares clave (parque, escuela, estación de bomberos). Cada miembro asume el rol de mediador cultural, explicando a "turistas visitantes" cómo llegar a los sitios y cuáles son las costumbres locales con oraciones sencillas y amables.',
              centurySkills: 'Comunicación intercultural, orientación espacial y mediación lingüística comunitaria.'
            },
            theme2Project: {
              themeName: 'Theme 2: Environmental Awareness & Sustainability',
              projectTitle: 'Project 2: School Waste Reduction & Eco-Awareness Campaign',
              category: 'Critical Thinking & STEAM Environmental Action',
              overview: 'Los alumnos investigan los residuos generados en el recreo, clasifican los materiales en un gráfico de barras visual, diseñan pancartas bilingües con lemas ecológicos ("Recycle plastic bottles because turtles need clean oceans!") y exponen una mini-propuesta de reciclaje de 2 minutos ante el salón.',
              centurySkills: 'Pensamiento crítico ambiental, análisis de datos sencillos y diseño persuasivo.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'high_beginner',
    name: 'High Beginner',
    cefrLevel: 'A2',
    badgeColor: '#0D9488',
    bgColor: '#CCFBF1',
    clusters: [
      {
        subBandId: 'a2_premedia',
        gradesLabel: 'Grades 6 (A2.1), 7 (A2.2), 8 (A2.3), 9 (A2.4)',
        cefrCode: 'A2.1, A2.2, A2.3, A2.4',
        focus: 'Developing communicative competence in various contexts.',
        keyConsiderations: 'Authentic materials, diverse texts, discussions, presentations, writing tasks, and reading and listening comprehension strategies.',
        linguisticComponents: 'All four components are refined, emphasizing pragmatics (understanding and using language appropriately in different social and academic contexts, varying formality, comparatives, superlatives, and simple past narratives).',
        skills: {
          listening: {
            title: 'Podcast Mystery & Pragmatic Tone Detective',
            type: 'Lúdica & Concreta',
            materials: 'Audios breves auténticos (entrevistas de radio, avisos de transporte del Metro de Panamá, conversaciones entre amigos), matriz de escucha guiada.',
            description: 'Los estudiantes escuchan 3 extractos orales y analizan: propósito del emisor, nivel de formalidad (formal vs. informal), emoción subyacente y 3 datos cuantitativos concretos (precios, horarios, ubicaciones). Luego debaten en parejas qué pistas de entonación o vocabulario revelaron la intención del hablante.',
            evidence: 'Identificación de la intención comunicativa, inferencia pragmática del tono y extracción de datos fácticos precisos.',
            adaptation: 'Reproducir el audio dos veces con una pausa intermedia para verificar notas con un compañero de apoyo.'
          },
          reading: {
            title: 'Authentic Menu & Eco-Park Jigsaw Reading Strategy',
            type: 'Lúdica & Concreta',
            materials: 'Folletos turísticos reales del Parque Nacional Soberanía, cartas de fondas/restaurantes típicos, guías de viaje.',
            description: 'Técnica de rompecabezas (Jigsaw): A cada miembro del equipo se le asigna una sección (Precios y horarios, Normas de seguridad con animales, Senderos recomendados). Tras reunirse con los "expertos", regresan a su grupo base para resolver un reto: "Planifiquen una excursión escolar de un día con un presupuesto máximo de $20 por persona sin violar ninguna norma".',
            evidence: 'Lectura intensiva y selectiva (skimming & scanning) de textos informativos auténticos para la toma de decisiones prácticas.',
            adaptation: 'Proporcionar un glosario de términos técnicos (e.g., fee, admission, prohibited, trail).'
          },
          speaking: {
            title: 'Town Hall Simulation & Problem-Solving Circle',
            type: 'Lúdica & Concreta',
            materials: 'Tarjetas de roles (Alcalde, Estudiante, Ambientalista, Comerciante), moción de debate escolar, temporizador.',
            description: 'Los estudiantes simulan una reunión comunitaria para decidir el uso de un fondo municipal: "¿Construir una cancha sintética o un centro de reciclaje y huerto escolar?". Cada participante expone su postura en 90 segundos usando comparativos y superlativos ("A garden is more beneficial than a soccer field because..."), respondiendo a objeciones con cortesía.',
            evidence: 'Uso de lenguaje persuasivo con registro adecuado a una asamblea pública y justificación de argumentos con evidencia.',
            adaptation: 'Permitir el uso de tarjetas guía con conectores discursivos ("In my opinion", "Furthermore", "I respectfully disagree").'
          },
          writing: {
            title: 'Register Switch Workshop: Casual Chat vs. Formal School Email',
            type: 'Lúdica & Concreta',
            materials: 'Plantilla de doble columna (Mensaje de WhatsApp a un amigo vs. Correo formal a la dirección del colegio), rúbrica pragmática.',
            description: 'Frente a una misma situación (solicitar autorización para un proyecto extracurricular), los estudiantes redactan primero una versión informal para convencer a sus amigos de unirse y luego una versión formal dirigida a la dirección escolar, adaptando saludos ("Hey guys" vs. "Dear Principal"), vocabulario, contracciones y despedidas formales.',
            evidence: 'Demostración de competencia pragmática y sociolingüística a través de la adecuación del registro escrito.',
            adaptation: 'Facilitar una tabla de equivalencias de formalidad antes de redactar.'
          },
          mediation: {
            theme1Project: {
              themeName: 'Theme 1: Peer Inclusion & School Culture',
              projectTitle: 'Project 1: "Our New Classmates" Bilingual Welcome Video & Guide',
              category: 'Interpersonal & School Mediation',
              overview: 'Los estudiantes entrevistan a alumnos de nuevo ingreso sobre sus expectativas y dificultades. Producen un vídeo o guía digital en Canva de 2 minutos donde resumen las normas escolares, explican modismos y dan consejos prácticos de adaptación, facilitando la inclusión social.',
              centurySkills: 'Mediación de la comunicación escolar, empatía intercultural y producción audiovisual colaborativa.'
            },
            theme2Project: {
              themeName: 'Theme 2: Biodiversity & Canal Watershed Innovation',
              projectTitle: 'Project 2: Panama Eco-App Prototype & Community Pitch',
              category: 'Critical Thinking, STEAM & Digital Prototyping',
              overview: 'En equipos de 4, los estudiantes diseñan el prototipo en papel o diapositivas interactivas de una aplicación móvil para proteger la cuenca del Canal de Panamá o monitorear especies amenazadas (Águila Arpía, Manatí). Presentan su "pitch" en inglés con apoyo de carteles gráficos ante un panel de jueces.',
              centurySkills: 'Pensamiento de diseño (Design Thinking), solución de problemáticas reales y oratoria pública.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'pre_intermediate',
    name: 'Pre-Intermediate',
    cefrLevel: 'B1',
    badgeColor: '#4338CA',
    bgColor: '#EDE9FE',
    clusters: [
      {
        subBandId: 'b1_media',
        gradesLabel: 'Grades 10 (B1.1), 11 (B1.2), 12 (B1.3)',
        cefrCode: 'B1.1, B1.2, B1.3',
        focus: 'Solidifying independent language use and preparing for further studies.',
        keyConsiderations: 'Academic and technical vocabulary, formal and informal registers, complex grammar, critical thinking, authentic materials, research, and writing workshops.',
        linguisticComponents: 'All four components are further refined, integrated and applied to increasingly complex academic and professional contexts (modals of deduction, passive voice, relative clauses, academic collocations, and argumentation).',
        skills: {
          listening: {
            title: 'TED-Style Academic Lecture & Cornell Note-Taking Matrix',
            type: 'Lúdica & Concreta',
            materials: 'Grabación de una mini-conferencia académica de 3-4 minutos sobre logística marítima, energía limpia o ética digital; plantilla de apuntes Cornell.',
            description: 'Los estudiantes escuchan el discurso tomando notas estructuradas: columna izquierda para palabras clave y preguntas reflexivas; columna derecha para ideas principales y evidencia fáctica; base para resumen en 3 oraciones. En parejas, contrastan sus apuntes y formulan 2 preguntas críticas para el ponente.',
            evidence: 'Capacidad de síntesis de discursos extensos, extracción de argumentos centrales y formulación de preguntas de alto orden de pensamiento.',
            adaptation: 'Permitir el uso de subtítulos en inglés en la primera escucha si el tema contiene alta densidad técnica.'
          },
          reading: {
            title: 'Multi-Text Critical Analysis & Bias Detection Workshop',
            type: 'Lúdica & Concreta',
            materials: 'Dos artículos periodísticos auténticos con posturas divergentes sobre el impacto de la inteligencia artificial o el turismo masivo.',
            description: 'Los estudiantes leen de forma crítica ambos textos y completan una matriz analítica: Tesis principal, Evidencia estadística aportada, Presuposiciones no declaradas, Lenguaje connotativo y Sesgo editorial. Luego redactan una síntesis neutral de 100 palabras que integre ambas visiones.',
            evidence: 'Distinción entre hechos comprobables y opiniones sesgadas, y evaluación crítica de la confiabilidad de las fuentes.',
            adaptation: 'Subrayar previamente en los textos 3 oraciones clave para orientar a estudiantes que requieran andamiaje.'
          },
          speaking: {
            title: 'Oxford Parliamentary Mini-Debate & Capstone Defense',
            type: 'Lúdica & Concreta',
            materials: 'Tarjetas de moción formal ("This House would ban single-use plastics in all Panamanian commerce"), mazo de Points of Information (POI), campana y cronómetro.',
            description: 'Equipos de 3 (Gobierno vs. Oposición) se enfrentan en rondas de debate reglado. Cada orador tiene 2 minutos para presentar su argumento, aceptar o rechazar interpelaciones (POI) y refutar con evidencia contrastada utilizando conectores discursivos avanzados ("While it may be argued that...", "The evidence clearly indicates...").',
            evidence: 'Articulación espontánea y fluida de argumentos complejos, manejo del registro formal académico y defensa bajo presión de tiempo.',
            adaptation: 'Asignar roles de investigador o cronometrador a estudiantes en etapas iniciales del nivel para fomentar su seguridad.'
          },
          writing: {
            title: 'Writing Workshop: Academic Position Paper & Project Proposal',
            type: 'Lúdica & Concreta',
            materials: 'Plantilla de propuesta formal (Executive Summary, Problem Statement, Methodology, Budget, Expected Impact), rúbrica analítica AOA.',
            description: 'Proceso de escritura en etapas (Brainstorming → Outline → Draft → Peer Review → Final Paper): Los estudiantes redactan un ensayo persuasivo o una propuesta de subvención de 300-400 palabras defendiendo una solución a una problemática nacional (e.g., reforestación de cuencas canaleras), empleando voz pasiva formal y citas textuales.',
            evidence: 'Producción de textos estructurados en múltiples párrafos con coherencia, cohesión léxica, voz pasiva y registro profesional impecable.',
            adaptation: 'Ofrecer una sesión de conferencia individual con el docente durante la fase de borrador intermedio.'
          },
          mediation: {
            theme1Project: {
              themeName: 'Theme 1: Intercultural & Institutional Mediation',
              projectTitle: 'Project 1: Model United Nations / Youth Climate Summit Simulation',
              category: 'High-Level Mediation & Consensus Building',
              overview: 'Los estudiantes asumen el papel de delegados de distintos países o sectores sociales (Gobierno, Comunidades Indígenas, ONG Ambientalistas). Deben mediar entre intereses económicos y ecológicos contrapuestos para redactar y firmar una Declaración Conjunta de Consenso redactada en lenguaje claro y accesible para todos.',
              centurySkills: 'Negociación diplomática, mediación de conflictos, síntesis de políticas públicas y empatía global.'
            },
            theme2Project: {
              themeName: 'Theme 2: Social Entrepreneurship & Digital Capstone',
              projectTitle: 'Project 2: Sustainable Business Capstone & Video Investor Pitch',
              category: 'Entrepreneurship, Innovation & Digital Media',
              overview: 'Los equipos desarrollan un plan de negocio social orientado a uno de los Objetivos de Desarrollo Sostenible (ODS) de la ONU en Panamá (energía solar comunitaria, ecoturismo inclusivo). Crean un portafolio digital en Canva/Google Sites y graban un video "pitch" de 3 minutos para inversionistas de impacto social.',
              centurySkills: 'Emprendimiento social, innovación financiera sostenible, liderazgo de proyectos y comunicación digital.'
            }
          }
        }
      }
    ]
  }
];

export function getGroupById(groupId) {
  return CEFR_LINGUISTIC_GROUPS.find(g => g.id === groupId) || null;
}

export function getAllClusters() {
  const list = [];
  CEFR_LINGUISTIC_GROUPS.forEach(g => {
    g.clusters.forEach(c => {
      list.push({
        groupId: g.id,
        groupName: g.name,
        cefrLevel: g.cefrLevel,
        badgeColor: g.badgeColor,
        ...c
      });
    });
  });
  return list;
}
