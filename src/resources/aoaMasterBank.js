// EDUGEN PRO · BANCO MAESTRO DE ACTIVIDADES PEDAGÓGICAS AOA
// Catálogo Curricular por Macro-Habilidad, Niveles CEFR y las 6 Etapas AOA (MEDUCA Panamá)
// Marco de Referencia: Enfoque Orientado a la Acción (AOA) · CEFR Companion Volume 2020
// Alcance: Pre-K a 12° Grado (Pre-A1 a B1+) · 8 Escenarios por Grado · 5 Macro-Habilidades

export const CEFR_BANDS = {
  'pre-a1': {
    name: 'Educación Inicial',
    grades: ['prek', 'kinder'],
    cefr: 'Pre-A1 Receptivo',
    focus: 'Respuesta Física Total (TPR), discriminación auditiva y visual, señalamiento de fotos reales, gestos (thumbs up/down, nod/shake). Cero lectoescritura forzada.',
    isEarly: true
  },
  'a1.1': {
    name: 'Primaria Baja',
    grades: ['1st', '2nd'],
    cefr: 'Pre-A1 / A1.1',
    focus: 'Comandos de aula, palabras aisladas con apoyo de imágenes reales, trazado de números/letras, emparejamiento gráfico.'
  },
  'a1': {
    name: 'Primaria Media',
    grades: ['3rd', '4th'],
    cefr: 'A1',
    focus: 'Frases hechas, preguntas cerradas (Where is...?, How many...?), lectura guiada con pictogramas, intercambios breves en parejas.'
  },
  'a1+': {
    name: 'Primaria Alta',
    grades: ['5th', '6th'],
    cefr: 'A1+',
    focus: 'Instrucciones de 2 a 3 pasos, descripciones de personas y lugares panameños, redacción de notas y etiquetas guiadas.'
  },
  'a2': {
    name: 'Pre-Media',
    grades: ['7th', '8th', '9th'],
    cefr: 'A2 / A2+',
    focus: 'Tareas auténticas situacionales (compras en el mercado, trámites de transporte, pedidos en fondas, oficios técnicos del Canal).'
  },
  'b1': {
    name: 'Educación Media',
    grades: ['10th', '11th', '12th'],
    cefr: 'B1 / B1+',
    focus: 'Negociación formal, mediación intercultural, debates, mini-proyectos sostenibles (ecoturismo, logística marítima, conservación de cuencas).'
  }
};

export function resolveCefrBand(gradeStr) {
  const g = String(gradeStr || '').toLowerCase();
  if (/pre-?k|kinder|inicial|early/i.test(g)) return 'pre-a1';
  if (/1st|2nd|primero|segundo|1°|2°/i.test(g)) return 'a1.1';
  if (/3rd|4th|tercero|cuarto|3°|4°/i.test(g)) return 'a1';
  if (/5th|6th|quinto|sexto|5°|6°/i.test(g)) return 'a1+';
  if (/7th|8th|9th|séptimo|octavo|noveno|7°|8°|9°|pre-?media/i.test(g)) return 'a2';
  if (/10th|11th|12th|décimo|undécimo|duodécimo|10°|11°|12°|media/i.test(g)) return 'b1';
  return 'a1'; // default primary
}

export const AOA_MASTER_CATALOG = {
  // ══════════════════════════════════════════════════════════════════
  // LECCIÓN 1: LISTENING (Comprensión Auditiva & Discriminación)
  // ══════════════════════════════════════════════════════════════════
  listening: {
    skillLabel: 'Listening',
    purpose: 'Desarrollar la capacidad del estudiante para actuar como oyente activo: extraer información específica, seguir comandos motrices y responder con acciones no verbales o verbales mínimas.',
    stages: {
      stage1: {
        title: 'Stage 1: Warm-up / Pre-task (Activación & Enganche)',
        activities: {
          'pre-a1': {
            name: 'Simon Says with Classroom Realia',
            desc: 'El docente da comandos: "Simon says, touch the desk! Touch your book!". Los alumnos tocan el objeto real en su mesa.'
          },
          'a1': {
            name: 'Mystery Sound Box',
            desc: 'El docente reproduce efectos de audio de objetos del aula o animales panameños (rana dorada, tucán) y los niños levantan la tarjeta con la foto real correspondiente.'
          },
          'a2': {
            name: 'Audio Bingo Panameño (Albrook Terminal)',
            desc: 'Los alumnos tienen cartones con 6 destinos o precios en balboas/USD. Escuchan anuncios de megafonía de terminal de Albrook y marcan con fichas.'
          },
          'b1': {
            name: 'Radio Climate Alert Forecast (Canal de Panamá)',
            desc: 'Escucha de un clip de audio de 30 segundos sobre el pronóstico del Canal de Panamá; los alumnos predicen en 2 minutos qué impacto tendrá en el paso de buques.'
          }
        }
      },
      stage2: {
        title: 'Stage 2: Presentation (Input Comprensivo Situacional)',
        activities: {
          'pre-a1': {
            name: 'Look & Touch Modeling',
            desc: 'El docente narra una historia breve con objetos físicos: "Look! The book is ON the desk". Modela con lentitud y gesticulación exagerada.'
          },
          'a1': {
            name: 'Echo Storytime',
            desc: 'Lectura en voz alta apoyada en diapositivas con fotos reales. Cada vez que aparece una preposición o palabra clave, los estudiantes hacen un movimiento corporal convenido.'
          },
          'a2': {
            name: 'Audio Menu Order Breakdown (Fonda Panameña)',
            desc: 'Reproducción de una conversación auténtica grabada entre un cliente y un dependiente en una fonda. El docente formula preguntas de chequeo conceptual (CCQs): "Did the tourist order fish or beef?".'
          },
          'b1': {
            name: 'Authentic Safety Briefing (ACP Maritime Protocol)',
            desc: 'Escucha de un protocolo de seguridad industrial de la ACP. Análisis guiado de conectores de causa y efecto en la instrucción verbal.'
          }
        }
      },
      stage3: {
        title: 'Stage 3: Practice (Precisión Auditiva Guiada)',
        activities: {
          'pre-a1': {
            name: 'Thumbs Up / Thumbs Down Visual Check',
            desc: 'El docente dice "The crayon is UNDER the chair" mientras lo coloca sobre la mesa. Los niños evalúan mostrando pulgar arriba 👍 o abajo 👎.'
          },
          'a1': {
            name: 'Flyswatter / Pointing Relay',
            desc: 'Dos alumnos frente a la pizarra con fotos reales. Al escuchar la palabra o frase espacial, corren a señalar la imagen exacta.'
          },
          'a2': {
            name: 'Information Gap Audio Grid (Metro & Buses)',
            desc: 'Estudiante A escucha un audio A (horarios de buses) y Estudiante B un audio B (tarifas); cotejan datos para completar una matriz sin ver el papel del otro.'
          },
          'b1': {
            name: 'Audio Note-Taking & Fact-Checking (Isla Colón)',
            desc: 'Escucha de un podcast ambiental sobre Isla Colón. Los alumnos identifican 3 datos incorrectos en un resumen impreso.'
          }
        }
      },
      stage4: {
        title: 'Stage 4: Performance / Production (Action Task de Escucha)',
        activities: {
          'pre-a1': {
            name: 'Teacher Says, Students Do Challenge',
            desc: 'Secuencia motriz rápida: "Put your book under your chair! Put your pencil in your bag!". Registro del desempeño en checklist de observación.'
          },
          'a1': {
            name: 'Classroom Architect',
            desc: 'En parejas, el estudiante A da instrucciones espaciales en inglés ("Put the ruler next to the pencil") y el estudiante B organiza los objetos reales sobre el pupitre.'
          },
          'a2': {
            name: 'Dispatch Center Simulation (Ciudad de Panamá)',
            desc: 'En parejas, un alumno actúa como operador de radio que transmite instrucciones de entrega a un repartidor en Ciudad de Panamá.'
          },
          'b1': {
            name: 'Simulated Emergency Evacuation Drill (Maritime Crew)',
            desc: 'Escucha de alertas continuas de audio en inglés técnico; los alumnos deben mapear en un plano arquitectónico la ruta de escape segura para una tripulación.'
          }
        }
      },
      stage5: {
        title: 'Stage 5: Assessment (Evaluación Formativa MEDUCA)',
        activities: {
          'pre-a1': {
            name: 'Observation Checklist (4 Indicadores Motrices)',
            criteria: ['Responde a comando físico inmediato', 'Identifica el objeto real correcto', 'Muestra comprensión gestual (thumbs up/down)', 'Participa con autonomía']
          },
          'a1': {
            name: 'Auditory Precision Checklist',
            criteria: ['Identificación de palabras clave en audio', 'Respuesta kinestésica precisa', 'Tasa de acierto > 80%', 'Colaboración en parejas']
          },
          'a2': {
            name: 'MEDUCA 3-Criterion Rubric (Pre-Media)',
            criteria: ['Task Completion in real-time', 'Accuracy in detail discrimination', 'Response speed and verification']
          },
          'b1': {
            name: 'Technical Listening Rubric (Media)',
            criteria: ['Comprehension of technical briefing', 'Synthesizing key variables', 'Emergency protocol mapping accuracy']
          }
        }
      },
      stage6: {
        title: 'Stage 6: Reflection (Metacognición & Can-Do)',
        activities: {
          'pre-a1': {
            tool: 'Emoji Face Slips (😊 / 😐)',
            prompt: 'Marca cómo te sentiste escuchando y siguiendo los comandos en inglés hoy.'
          },
          'a1': {
            tool: 'Star Rating & Can-Do',
            prompt: 'I can point to the correct object when the teacher names it in English (⭐ ⭐ ⭐ ⭐ ⭐).'
          },
          'a2': {
            tool: 'Can-Do Self-Declaration',
            prompt: 'I can extract times, prices in balboas/USD, and travel routes from spoken announcements.'
          },
          'b1': {
            tool: 'Professional Competence Can-Do',
            prompt: 'I can follow 3-step technical directions delivered at natural native speed in authentic logistics contexts.'
          }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // LECCIÓN 2: READING (Comprensión Lectora & Textos Auténticos)
  // ══════════════════════════════════════════════════════════════════
  reading: {
    skillLabel: 'Reading',
    purpose: 'Desarrollar la alfabetización funcional desde la lectura emergente por pictogramas y fotos en preescolar hasta el análisis crítico de textos auténticos del entorno laboral y ecológico panameño en educación media.',
    stages: {
      stage1: {
        title: 'Stage 1: Warm-up / Pre-task (Activación & Enganche)',
        activities: {
          'pre-a1': {
            name: 'Sign & Logo Scavenger Hunt',
            desc: 'Identificación visual de símbolos del aula y logotipos reconocibles (flechas de salida, letreros de baño, números grandes).'
          },
          'a1': {
            name: 'Word-Photo Flash Match',
            desc: 'Tarjetas grandes: una mitad tiene la fotografía real y la otra la palabra en imprenta mayúscula. Los alumnos unen las parejas.'
          },
          'a2': {
            name: 'Menu Skimming Race (Marisquería Panameña)',
            desc: 'Se proyecta durante 15 segundos el menú real de una marisquería panameña; los alumnos anotan rápidamente el plato más costoso y el más económico.'
          },
          'b1': {
            name: 'Headline Prediction Hook (Canal de Panamá News)',
            desc: 'Lectura de tres titulares de prensa en inglés sobre el Canal de Panamá; lluvia de ideas sobre el tema central en 2 minutos.'
          }
        }
      },
      stage2: {
        title: 'Stage 2: Presentation (Modelado de Estrategias de Lectura)',
        activities: {
          'pre-a1': {
            name: 'Big Book Shared Reading',
            desc: 'Lectura de un rotafolio ilustrado con fotos reales donde el docente modela la direccionalidad de la lectura (izquierda a derecha) con su dedo índice.'
          },
          'a1': {
            name: 'Choral Reading with Realia Cues',
            desc: 'Lectura guiada en voz alta de un párrafo descriptivo breve, señalando con puntero las palabras clave.'
          },
          'a2': {
            name: 'Scanning Guide for Schedules (Metro de Panamá)',
            desc: 'El docente modela cómo buscar números de vuelo o paradas del Metro de Panamá sin leer palabra por palabra (técnica de escaneo visual).'
          },
          'b1': {
            name: 'Text Structure & Vocabulary in Context (ATP Tourism Brochure)',
            desc: 'Lectura de un folleto de la Autoridad de Turismo de Panamá (ATP); identificación de adjetivos persuasivos y causas/efectos ecológicos.'
          }
        }
      },
      stage3: {
        title: 'Stage 3: Practice (Comprensión Guiada & Emparejamiento)',
        activities: {
          'pre-a1': {
            name: 'Color the Target Symbol',
            desc: 'Los niños reciben una ficha con 4 fotos reales y circulan con crayón el objeto mencionado en el rótulo leído por el docente.'
          },
          'a1': {
            name: 'Sentence-Picture Strip Match',
            desc: 'En parejas, ordenan tiras de cartulina con oraciones breves ("The cat is on the chair") debajo de la foto real correspondiente.'
          },
          'a2': {
            name: 'True/False Text Hunt (San Blas Itinerary)',
            desc: 'Lectura de un itinerario de viaje en San Blas; responder 4 preguntas marcando el párrafo exacto donde se encuentra la evidencia.'
          },
          'b1': {
            name: 'Jigsaw Reading Task (Environmental Contingency Manual)',
            desc: 'En grupos de 4, cada alumno lee una sección diferente de un manual de contingencia ambiental y completa su cuadrante de notas.'
          }
        }
      },
      stage4: {
        title: 'Stage 4: Performance / Production (Action Task de Lectura)',
        activities: {
          'pre-a1': {
            name: 'Classroom Labeling Tour',
            desc: 'Cada niño recibe una tarjeta plastificada con una foto real y su palabra; camina por el aula y la coloca sobre el objeto físico correspondiente.'
          },
          'a1': {
            name: 'Supermarket Shelf Organizer',
            desc: 'Lectura de una lista de compras real en inglés y clasificación física de envases o réplicas en estantes designados.'
          },
          'a2': {
            name: 'Tour Route Planning Challenge (Casco Antiguo)',
            desc: 'A partir de 3 folletos de transporte y atractivos de Casco Antiguo, las parejas trazan el itinerario más económico en un mapa turístico.'
          },
          'b1': {
            name: 'Job Requirement Screening Task (ACP Vacancies)',
            desc: 'Lectura de 3 perfiles de vacantes en la ACP y 3 hojas de vida simuladas; seleccionar y justificar por escrito cuál candidato califica para el puesto.'
          }
        }
      },
      stage5: {
        title: 'Stage 5: Assessment (Evaluación Formativa)',
        activities: {
          'pre-a1': {
            name: 'Visual Literacy Checklist',
            criteria: ['Asocia símbolo con significado', 'Señala foto correspondiente', 'Muestra interés en lectura compartida', 'Sigue direccionalidad izquierda a derecha']
          },
          'a1': {
            name: 'Reading Accuracy & Evidence Check',
            criteria: ['Decodificación de palabras clave', 'Emparejamiento oración-imagen correcto', 'Comprensión literal demostrada', 'Autonomía en lectura de rótulos']
          },
          'a2': {
            name: 'Functional Reading Rubric',
            criteria: ['Localización de datos específicos (Scanning)', 'Discriminación de Verdadero/Falso con evidencia', 'Planificación del itinerario según el texto']
          },
          'b1': {
            name: 'Critical Reading & Screening Rubric',
            criteria: ['Evaluación de requisitos técnicos', 'Justificación basada en evidencia textual', 'Precisión en extracción de argumentos clave']
          }
        }
      },
      stage6: {
        title: 'Stage 6: Reflection (Metacognición)',
        activities: {
          'pre-a1': {
            tool: 'Emoji Reading Slips (📖 😊 / 😐)',
            prompt: '¿Te gustó mirar las fotos y descubrir las palabras del aula?'
          },
          'a1': {
            tool: 'Reading Strategy Check',
            prompt: '¿Qué te ayudó más a entender el texto? (¿Ver las fotos? ¿Buscar palabras parecidas al español? ¿Leer con un compañero?)'
          },
          'a2': {
            tool: 'Scanning Efficiency Self-Check',
            prompt: '¿Logré encontrar el precio o la parada sin leer cada palabra del texto?'
          },
          'b1': {
            tool: 'Critical Reader Declaration',
            prompt: 'I can extract relevant technical requirements from complex authentic documents to make informed professional decisions.'
          }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // LECCIÓN 3: WRITING (Producción Escrita Social & Entregables)
  // ══════════════════════════════════════════════════════════════════
  writing: {
    skillLabel: 'Writing',
    purpose: 'Generar textos auténticos con propósito social reconocible: desde el rotulado (labeling) y trazado en inicial hasta formularios oficiales, comandas de restaurante y campañas comunitarias en secundaria.',
    stages: {
      stage1: {
        title: 'Stage 1: Warm-up / Pre-task (Activación & Enganche)',
        activities: {
          'pre-a1': {
            name: 'Air Tracing & Finger Gym',
            desc: 'Trazado de líneas rectas, círculos y preposiciones espaciales en el aire o sobre bandejas de arena al ritmo de palmadas.'
          },
          'a1': {
            name: 'Alphabet Word Relay',
            desc: 'Competencia por filas para escribir en la pizarra palabras aprendidas de útiles escolares o animales locales.'
          },
          'a2': {
            name: 'Form Field Brainstorm (Tocumen Immigration Card)',
            desc: 'Proyección de un formulario real en blanco (tarjeta de inmigración de Tocumen); identificar qué datos pide cada campo.'
          },
          'b1': {
            name: 'Complaint Tweet Hook (Eco-Tourism Feedback)',
            desc: 'Análisis de 2 mensajes breves de redes sociales de turistas descontentos; redactar en 3 minutos una lista de los 3 problemas principales.'
          }
        }
      },
      stage2: {
        title: 'Stage 2: Presentation (Modelado de Géneros Textuales)',
        activities: {
          'pre-a1': {
            name: 'Visual Label Modeling',
            desc: 'El docente muestra cómo rotular una caja con la foto y la palabra "PENCILS" en letra de imprenta clara.'
          },
          'a1': {
            name: 'Fill-in-the-Blanks Template Walkthrough',
            desc: 'Modelado de un pase de salida con estructura fija: "My name is... My favorite object is...".'
          },
          'a2': {
            name: 'Receipt & Order Slip Deconstruction (Factura Panameña)',
            desc: 'Desglose de las partes de una factura panameña: encabezado, cantidad, descripción del ítem, subtotal y total en USD.'
          },
          'b1': {
            name: 'Formal Email vs Informal Note Structure (Ecological Request)',
            desc: 'Modelado de fórmulas de cortesía, asunto conciso y cuerpo argumentativo para una carta de solicitud ecológica.'
          }
        }
      },
      stage3: {
        title: 'Stage 3: Practice (Escritura Scaffolded / Guiada)',
        activities: {
          'pre-a1': {
            name: 'Trace and Draw Homework Box',
            desc: 'Trazado guiado de la letra inicial del objeto y dibujo libre de su ubicación en casa.'
          },
          'a1': {
            name: 'Sentence Scramble Cards',
            desc: 'Tarjetas con palabras desordenadas ("is / on / The / desk / book") que los alumnos reorganizan y copian en sus cuadernos.'
          },
          'a2': {
            name: 'Order Slip Drafting (Restaurant Comanda)',
            desc: 'Práctica en parejas de completar órdenes de restaurante simuladas con precios calculados y pedidos especiales.'
          },
          'b1': {
            name: 'Peer Editing Carousel (50-word Eco Rules Draft)',
            desc: 'Redacción de un borrador de 50 palabras sobre normas ecológicas; intercambio con un compañero para verificar ortografía y puntuación usando rúbrica rápida.'
          }
        }
      },
      stage4: {
        title: 'Stage 4: Performance / Production (Action Task de Escritura)',
        activities: {
          'pre-a1': {
            name: 'My Room Object Poster',
            desc: 'Los niños dibujan su libro o juguete favorito en una posición espacial clara (ON bed, UNDER table) y el docente les asiste en colocar el rótulo.'
          },
          'a1': {
            name: 'Lost and Found Notice',
            desc: 'Elaboración de un letrero real para la cartelera de la escuela buscando un útil perdido, con foto/dibujo, color y ubicación probable.'
          },
          'a2': {
            name: 'Restaurant Order Deliverable (Comanda Oficial en USD)',
            desc: 'Creación del comprobante de comanda oficial con 3 platos, bebidas típicas, desglose de precios en USD y firma del cliente.'
          },
          'b1': {
            name: '3-Rule Eco-Tourist Code of Conduct Pamphlet',
            desc: 'Diseño y redacción de un folleto de 3 reglas estrictas con condicionales para proteger arrecifes o fauna local panameña.'
          }
        }
      },
      stage5: {
        title: 'Stage 5: Assessment (Evaluación Formativa)',
        activities: {
          'pre-a1': {
            name: 'Motor Trace & Representation Checklist',
            criteria: ['Agarre del crayón/lápiz adecuado', 'Trazado de líneas guía', 'Representación visual del objeto', 'Cuidado del papel']
          },
          'a1': {
            name: 'MEDUCA Primary Writing Rubric',
            criteria: ['Legibilidad y separación de palabras', 'Ortografía de vocabulario meta', 'Estructura de la oración básica', 'Presentación del cartelito']
          },
          'a2': {
            name: 'Functional Deliverable Rubric (Pre-Media)',
            criteria: ['Estructura del formato oficial (comanda/recibo)', 'Corrección en precios y cálculos en USD', 'Uso de vocabulario situacional auténtico', 'Claridad en la caligrafía/digitación']
          },
          'b1': {
            name: 'MEDUCA 4-Criterion Advanced Writing Rubric',
            criteria: ['Formato y Estructura Social', 'Corrección Gramatical y Cohesión', 'Uso del Vocabulario Meta Especializado', 'Impacto y Calidad del Entregable']
          }
        }
      },
      stage6: {
        title: 'Stage 6: Reflection (Metacognición)',
        activities: {
          'pre-a1': {
            tool: 'Proud Sticker Slip',
            prompt: 'Coloca una estrella en tu dibujo si te esforzaste en trazar con cuidado.'
          },
          'a1': {
            tool: 'Author\'s Self-Check (3 preguntas)',
            prompt: '¿Puse mayúscula al inicio? ¿Dejé espacio entre palabras? ¿Se entiende mi letra?'
          },
          'a2': {
            tool: 'Deliverable Verification Checklist',
            prompt: '¿Mi comanda o formulario tiene todos los datos necesarios para que otra persona la entienda sin errores?'
          },
          'b1': {
            tool: 'Professional Code Review Reflection',
            prompt: '¿El tono y las reglas que redacté transmiten autoridad profesional y respeto al ecosistema?'
          }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // LECCIÓN 4: SPEAKING (Interacción Oral & Acción Social)
  // ══════════════════════════════════════════════════════════════════
  speaking: {
    skillLabel: 'Speaking',
    purpose: 'Entrenar al estudiante para desenvolverse en situaciones del mundo real donde se requiere fluidez, entonación, fórmulas de cortesía, negociación de acuerdos y brecha de información.',
    stages: {
      stage1: {
        title: 'Stage 1: Warm-up / Pre-task (Activación & Enganche)',
        activities: {
          'pre-a1': {
            name: 'Choral Chant & Clap',
            desc: 'Canto rítmico con palmadas repitiendo fonemas y palabras clave: "Book, book, on the desk! Desk, desk, under the chair!".'
          },
          'a1': {
            name: 'Ball Toss Rapid Questioning',
            desc: 'Lanzar una pelota suave; quien la recibe responde con una palabra y formula una nueva pregunta ("Where is the pencil?" -> "There!").'
          },
          'a2': {
            name: 'Speed Greetings & Small Talk (Fonda & Mercado)',
            desc: 'Rueda de citas rápidas (Speed Dating) de 1 minuto saludando como cliente y dependiente panameño.'
          },
          'b1': {
            name: 'Devil\'s Advocate 60-Second Challenge (Canal Tolls Debate)',
            desc: 'En parejas, un estudiante defiende el aumento del costo de peajes en el Canal y el otro expone una objeción breve.'
          }
        }
      },
      stage2: {
        title: 'Stage 2: Presentation (Modelado de Diálogos & Cortesía)',
        activities: {
          'pre-a1': {
            name: 'Puppet Modeling Dialogue',
            desc: 'Dos títeres interactúan frente a la clase modelando preguntas y respuestas cortas con objetos reales.'
          },
          'a1': {
            name: 'Pronunciation & Intonation Wave',
            desc: 'Repetición coral variando el volumen (susurro, voz normal, voz entusiasta) de frases de solicitud cortés ("Here you are / Thank you").'
          },
          'a2': {
            name: 'Functional Dialogue Drill (Ordering in English)',
            desc: 'Desglose de fórmulas clave para negociar menú: "Could I have...?", "How much is...?", "Does it include...?".'
          },
          'b1': {
            name: 'Polite Disagreement & Negotiation Strategies',
            desc: 'Modelado de conectores para disentir con respeto en un ambiente de negocios ("I see your point, however...", "Could we consider...?").'
          }
        }
      },
      stage3: {
        title: 'Stage 3: Practice (Práctica Controlada con Brecha)',
        activities: {
          'pre-a1': {
            name: 'Pair Echo Drill',
            desc: 'El estudiante A muestra una foto y dice la palabra; el estudiante B asiente y la repite imitando el tono.'
          },
          'a1': {
            name: 'Find Someone Who...',
            desc: 'Hoja con imágenes donde deben circular y preguntar a sus compañeros para encontrar quién tiene un lápiz azul o un borrador rojo.'
          },
          'a2': {
            name: 'Menu Substitution Drill',
            desc: 'En parejas practican variar el diálogo original cambiando platos y precios con tarjetas de opciones.'
          },
          'b1': {
            name: 'Role-Play Rehearsal with Secret Cue Cards',
            desc: 'Parejas con tarjetas de objetivos secretos (ej. conseguir descuento, convencer al guía turístico de cambiar la ruta).'
          }
        }
      },
      stage4: {
        title: 'Stage 4: Performance / Production (Action Task de Interacción Oral)',
        activities: {
          'pre-a1': {
            name: 'Show and Tell My Classroom Object',
            desc: 'El niño se pone de pie, levanta su libro y emite el comando a un compañero: "Book on table!".'
          },
          'a1': {
            name: 'Market Stall Mini-Roleplay',
            desc: 'Puesto de útiles escolares en el aula donde un alumno vende lápices y cuadernos y el otro realiza la compra con monedas didácticas.'
          },
          'a2': {
            name: 'Mercado del Marisco Authentic Ordering ($15 USD Budget)',
            desc: 'Simulación completa en parejas con presupuesto de $15.00 USD, preguntas sobre menú, toma de orden y despedida cortés.'
          },
          'b1': {
            name: 'ACP Job Interview Simulation (5-Minute Technical Panel)',
            desc: 'Entrevista formal de 5 minutos donde el reclutador evalúa competencias técnicas de seguridad marítima y el postulante sustenta su experiencia.'
          }
        }
      },
      stage5: {
        title: 'Stage 5: Assessment (Evaluación Formativa)',
        activities: {
          'pre-a1': {
            name: 'Oral Gesture & Imitation Checklist',
            criteria: ['Pronunciación de palabras aisladas', 'Volumen de voz audible', 'Acompañamiento con gesto corporal', 'Disposición a participar']
          },
          'a1': {
            name: 'Primary Spoken Interaction Rubric',
            criteria: ['Fluidez en preguntas breves', 'Respuesta inteligible sin traducción', 'Uso de fórmulas de cortesía', 'Contacto visual con el compañero']
          },
          'a2': {
            name: 'Authentic Simulation Speaking Rubric (Pre-Media)',
            criteria: ['Fluidez y Entonación natural', 'Fórmulas de cortesía situacionales', 'Capacidad de negociar precios/opciones', 'Éxito comunicativo de la compra']
          },
          'b1': {
            name: 'Professional Spoken Fluency Rubric (Media)',
            criteria: ['Argumentación técnica estructurada', 'Manejo de contra-argumentos con cortesía', 'Léxico especializado marítimo/ecológico', 'Impacto profesional y persuasión']
          }
        }
      },
      stage6: {
        title: 'Stage 6: Reflection (Metacognición)',
        activities: {
          'pre-a1': {
            tool: 'Microphone High-Five Slip',
            prompt: 'Choca la mano con tu compañero si dijiste la palabra en voz alta y clara.'
          },
          'a1': {
            tool: 'Fluency Thermometer (Cold / Warm / Hot)',
            prompt: 'Marca en el termómetro qué tan seguro te sentiste hablando en inglés con tu compañero.'
          },
          'a2': {
            tool: 'Communicative Confidence Check',
            prompt: '¿Pude hacerme entender y completar el pedido sin cambiar al español?'
          },
          'b1': {
            tool: 'Professional Interview Self-Appraisal',
            prompt: '¿Logré defender mi postura técnica con solvencia y respeto ante preguntas difíciles?'
          }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // LECCIÓN 5: MEDIATION (Mediación Interpersonal & Lingüística)
  // ══════════════════════════════════════════════════════════════════
  mediation: {
    skillLabel: 'Mediation',
    purpose: 'La mediación entrena al alumno para facilitar la comunicación entre personas, actuar como puente cultural o lingüístico, explicar textos o gráficos complejos en lenguaje sencillo y colaborar en equipo para resolver desacuerdos.',
    stages: {
      stage1: {
        title: 'Stage 1: Warm-up / Pre-task (Activación & Enganche)',
        activities: {
          'pre-a1': {
            name: 'Gesture Relay for a Friend',
            desc: 'Un alumno no puede ver la tarjeta; su compañero le transmite con gestos no verbales qué objeto es (mediación kinestésica).'
          },
          'a1': {
            name: 'Picture Translator',
            desc: 'Se muestra una señal de tránsito o advertencia visual; los alumnos deben explicar con una sola palabra en inglés qué significa para un visitante.'
          },
          'a2': {
            name: 'Lost Tourist Situation Hook (Albrook Metro Station)',
            desc: 'Se presenta el caso de un turista que solo habla inglés y necesita llegar a la estación del Metro de Albrook; lluvia de ideas sobre cómo ayudarlo.'
          },
          'b1': {
            name: 'Cultural Misunderstanding Case (Local Vendor & Tourist)',
            desc: 'Breve historia de un malentendido de propinas o modismos entre un turista extranjero y un comerciante local; análisis del rol del mediador.'
          }
        }
      },
      stage2: {
        title: 'Stage 2: Presentation (Modelado de Estrategias de Mediación)',
        activities: {
          'pre-a1': {
            name: 'Helping My Classmate',
            desc: 'El docente modela cómo tomar la mano de un compañero tímido y guiarlo para señalar el libro en la mesa cuando este no comprendió el comando.'
          },
          'a1': {
            name: 'Paraphrasing with Simpler Words',
            desc: 'El docente muestra cómo convertir una frase difícil en dos palabras fáciles ("Proceed to the exit" -> "Go out").'
          },
          'a2': {
            name: 'Explaining Visual Information (Metro Schedule & Route Map)',
            desc: 'Modelado de cómo transformar un letrero de horarios o un mapa del Metro de Panamá en indicaciones habladas sencillas para un tercero.'
          },
          'b1': {
            name: 'Relaying Specific Information & Summarizing',
            desc: 'El docente demuestra cómo leer un folleto técnico de 3 páginas y extraer los 3 puntos esenciales para un colega que tiene prisa.'
          }
        }
      },
      stage3: {
        title: 'Stage 3: Practice (Práctica Guiada de Mediación)',
        activities: {
          'pre-a1': {
            name: 'Partner Mirroring',
            desc: 'En parejas frente a frente, un niño ejecuta una posición espacial y su compañero actúa como "espejo mediador" confirmando con la cabeza.'
          },
          'a1': {
            name: 'Bilingual Helper Drill',
            desc: 'El docente dice una instrucción en español simulando ser un abuelo; los niños le explican a un muñeco o títere en inglés qué debe hacer.'
          },
          'a2': {
            name: 'Menu Clarification Task (Corvina Frita & Patacones)',
            desc: 'En tríos: Turista extranjero (no habla español), mesonero (no habla inglés) y Mediador (estudiante que explica los ingredientes en inglés sencillo).'
          },
          'b1': {
            name: 'Collaborative Agreement Negotiation (Conflicting Budgets)',
            desc: 'En grupos de 3, conciliar dos propuestas turísticas distintas con presupuestos encontrados hasta llegar a una agenda común consensuada.'
          }
        }
      },
      stage4: {
        title: 'Stage 4: Performance / Production (Action Task de Mediación)',
        activities: {
          'pre-a1': {
            name: 'Group Cleanup Mediation',
            desc: 'En equipos de 3, un niño asume el rol de "Capitán" y guía con señas a sus compañeros para guardar los crayones en la mochila y los libros en la mesa.'
          },
          'a1': {
            name: 'Museum Guide for Kindergarteners (Canal de Panamá Exhibits)',
            desc: 'Los alumnos de 4° grado preparan una visita guiada con fotos del Canal y explican en inglés muy simple a alumnos menores qué hace cada barco.'
          },
          'a2': {
            name: 'Tourism Information Desk Simulation (Metro Card & Ceviche)',
            desc: 'En tríos rotativos: un viajero desorientado consulta cómo recargar la tarjeta del Metro o comprar ceviche; el mediador resuelve la duda de manera empática.'
          },
          'b1': {
            name: 'Community Environmental Conflict Mediation (Bocas del Toro Marine Life)',
            desc: 'Simulación de una mesa de trabajo en Bocas del Toro: un operador de lanchas, un biólogo marino y un mediador estudiantil que redacta un acuerdo preliminar.'
          }
        }
      },
      stage5: {
        title: 'Stage 5: Assessment (Evaluación Formativa de Mediación)',
        activities: {
          'pre-a1': {
            name: 'Peer Assistance Checklist',
            criteria: ['Ayuda empática a un compañero', 'Uso de señas de apoyo', 'Paciencia en la interacción', 'Logro conjunto de la acción']
          },
          'a1': {
            name: 'Simplification & Guidance Rubric',
            criteria: ['Claridad al simplificar palabras difíciles', 'Uso de gestos e imágenes de apoyo', 'Paciencia y tono amable', 'Comprensión mutua verificada']
          },
          'a2': {
            name: 'Interpersonal Mediation Rubric (Pre-Media)',
            criteria: ['Explicación clara de datos visuales/mapas', 'Empatía y escucha activa hacia el visitante', 'Precisión en precios y rutas', 'Eficacia del puente comunicativo']
          },
          'b1': {
            name: 'MEDUCA Conflict Resolution & Mediation Rubric',
            criteria: ['Claridad al sintetizar información técnica compleja', 'Neutralidad y empatía entre partes en conflicto', 'Habilidad de redacción de acuerdos consensuados', 'Éxito en la mediación comunitaria']
          }
        }
      },
      stage6: {
        title: 'Stage 6: Reflection (Metacognición & Valores Ciudadanos)',
        activities: {
          'pre-a1': {
            tool: 'Helping Hands Stamp Slip',
            prompt: 'Estampa tus manos si ayudaste a un amigo a entender el juego hoy.'
          },
          'a1': {
            tool: 'Mediator\'s Kindness Check',
            prompt: '¿Fui paciente al explicar la palabra a mi compañero? ¿Usé palabras sencillas?'
          },
          'a2': {
            tool: 'Tourist Helper Reflection',
            prompt: '¿El turista logró llegar a su destino o pedir su comida gracias a mi explicación clara?'
          },
          'b1': {
            tool: 'Mediator\'s Self-Awareness',
            prompt: '¿Ayudé a que las partes se entendieran mejor? ¿Fui neutral y empático al resolver el desacuerdo?'
          }
        }
      }
    }
  }
};

/**
 * Resolves the precise AOA 6-Stage curricular activities for any given grade & skill
 */
export function getAoaCurricularBlueprint({ grade, skill, scenario = '', lessonNum = 1 }) {
  const bandKey = resolveCefrBand(grade);
  const bandMeta = CEFR_BANDS[bandKey] || CEFR_BANDS['a1'];

  // Normalize skill key
  let sKey = 'listening';
  const sStr = String(skill || '').toLowerCase();
  if (/read/i.test(sStr) || lessonNum === 2) sKey = 'reading';
  else if (/writ/i.test(sStr) || lessonNum === 3) sKey = 'writing';
  else if (/speak|oral/i.test(sStr) || lessonNum === 4) sKey = 'speaking';
  else if (/mediat/i.test(sStr) || lessonNum === 5) sKey = 'mediation';
  else sKey = 'listening';

  const skillCatalog = AOA_MASTER_CATALOG[sKey] || AOA_MASTER_CATALOG.listening;

  // Resolve best activity for the CEFR band
  const resolveForBand = (stageObj) => {
    if (!stageObj || !stageObj.activities) return null;
    const acts = stageObj.activities;
    if (acts[bandKey]) return acts[bandKey];
    if (bandMeta.isEarly && acts['pre-a1']) return acts['pre-a1'];
    if ((bandKey === 'a1.1' || bandKey === 'a1' || bandKey === 'a1+') && acts['a1']) return acts['a1'];
    if (bandKey === 'a2' && acts['a2']) return acts['a2'];
    if (bandKey === 'b1' && acts['b1']) return acts['b1'];
    return acts['a1'] || acts['pre-a1'] || Object.values(acts)[0];
  };

  const stage1Act = resolveForBand(skillCatalog.stages.stage1);
  const stage2Act = resolveForBand(skillCatalog.stages.stage2);
  const stage3Act = resolveForBand(skillCatalog.stages.stage3);
  const stage4Act = resolveForBand(skillCatalog.stages.stage4);
  const stage5Act = resolveForBand(skillCatalog.stages.stage5);
  const stage6Act = resolveForBand(skillCatalog.stages.stage6);

  return {
    bandKey,
    bandMeta,
    skillKey: sKey,
    skillLabel: skillCatalog.skillLabel,
    skillPurpose: skillCatalog.purpose,
    stages: {
      stage1: {
        title: skillCatalog.stages.stage1.title,
        name: stage1Act?.name || 'Pre-task Warm-up',
        desc: stage1Act?.desc || 'Activación de conocimientos previos y contextualización.'
      },
      stage2: {
        title: skillCatalog.stages.stage2.title,
        name: stage2Act?.name || 'Comprehensible Input Modeling',
        desc: stage2Act?.desc || 'Modelado de la lengua meta en contexto auténtico.'
      },
      stage3: {
        title: skillCatalog.stages.stage3.title,
        name: stage3Act?.name || 'Guided Practice',
        desc: stage3Act?.desc || 'Práctica guiada con apoyo visual y andamiaje.'
      },
      stage4: {
        title: skillCatalog.stages.stage4.title,
        name: stage4Act?.name || 'Action Task Production',
        desc: stage4Act?.desc || 'Tarea de desempeño con entregable tangible auténtico.'
      },
      stage5: {
        title: skillCatalog.stages.stage5.title,
        name: stage5Act?.name || 'Formative Assessment',
        criteria: stage5Act?.criteria || ['Task Completion', 'Accuracy', 'Participation']
      },
      stage6: {
        title: skillCatalog.stages.stage6.title,
        tool: stage6Act?.tool || 'Metacognitive Self-Check',
        prompt: stage6Act?.prompt || 'Reflexión sobre el aprendizaje y logro del objetivo.'
      }
    }
  };
}
