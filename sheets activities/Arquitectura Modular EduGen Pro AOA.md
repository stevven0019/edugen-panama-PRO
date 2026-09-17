EDUTER & MEDUCA PANAMÁ: ESPECIFICACIÓN TÉCNICA DEL MOTOR CURRICULAR AOASistema EduGen Pro: Arquitectura de 14 Grados, 8 Escenarios, 5 Habilidades y 6 Etapas AOADestinatario Técnico: Agente Autónomo / Desarrollador AntiGravity (EduGen Pro Core Team)Marco Curricular: Enfoque Orientado a la Acción (AOA / Action-Oriented Approach) · MEDUCA PanamáMarco Lingüístico: Marco Común Europeo de Referencia (CEFR / MCER + Companion Volume 2020)Estado de Viabilidad: 100% Viable mediante arquitectura modular impulsada por datos y generadores algorítmicos.1. Alcance Global y Matriz Matemática del SistemaEl sistema gestiona una matriz jerárquica predecible y estandarizada:$$\text{14 Grados} \times \text{8 Escenarios} \times \text{5 Lecciones} = \mathbf{560 \text{ Lecciones Maestras}}$$Cada una de estas 560 lecciones se desglosa internamente en las 6 Etapas Obligatorias del Enfoque Orientado a la Acción (AOA) de MEDUCA.1.1 Mapa de Progresión CEFR por Grado Escolar (MEDUCA)Nivel EducativoGradosNivel CEFRFoco de Desempeño del EstudianteEducación InicialPre-K & KinderPre-A1 (Receptivo)Respuesta Física Total (TPR), señalamiento, discriminación auditiva y visual. Cero lectoescritura forzada.Primaria Baja1° y 2° GradoPre-A1 / A1.1Reconocimiento de palabras cotidianas, comandos de aula, trazos asistidos, respuestas de una palabra.Primaria Media3° y 4° GradoA1Frases fijas, preguntas simples (Where / What / How many), lectura gráfica, interacción guiada en parejas.Primaria Alta5° y 6° GradoA1+Descripciones sencillas, rutinas, instrucciones de 2 a 3 pasos, producción de textos breves guiados.Pre-Media7°, 8° y 9° GradoA2 / A2+Tareas auténticas cotidianas (compras, direcciones, transporte, oficios en el Canal), oraciones compuestas.Educación Media10°, 11° y 12° GradoB1 / B1+Negociación, debate, proyectos sostenibles (ecoturismo en Bocas, bio-conservación), mediación formal.2. Especialización Pedagógica de las 5 Lecciones por EscenarioDentro de cada uno de los 8 escenarios, las 5 lecciones se distribuyen siguiendo un ciclo de adquisición comunicativa:[Escenario Auténtico: Ej. "Where Is It?" / "At the Panama Canal"]
   │
   ├── Lección 1: LISTENING  ──► Entrada comprensiva (TPR, reconocimiento, discriminación de pistas)
   ├── Lección 2: READING    ──► Alfabetización visual, avisos reales, lectura rápida (skimming/scanning)
   ├── Lección 3: WRITING    ──► Desde trazos/rotulación (Pre-K/Kinder) hasta entregables formales (12°)
   ├── Lección 4: SPEAKING   ──► Interacción oral activa, simulación situacional, fluidez en parejas
   └── Lección 5: MEDIATION  ──► Mediación interpersonal, explicar conceptos a otros, traducir ideas visuales
Matriz Operativa de Habilidades:Lección 1: LISTENING (Enfoque Receptivo)Dinámica clave: "Listen & Do", "Listen & Point", verificación con pulgares o gestos.Material gráfico: Fotografías reales y mapas de objetos del entorno panameño.Producto: Registro de aciertos motrices / verificación en checklist de observación.Lección 2: READING (Decodificación y Comprensión Contextual)Dinámica clave: Emparejamiento de rótulos con fotos reales, menús de fondas, itinerarios de transporte.Pre-K/Kinder: Lectura emergente mediante pictogramas y logos reconocibles del entorno.Media (10°-12°): Artículos técnicos, normativas ambientales, manuales de procedimiento.Lección 3: WRITING (Producción Escrita Social)Dinámica clave: Creación de documentos reales (no oraciones sueltas).Pre-K a 2°: Trazado de números, encierre en círculos, dibujo guiado con etiquetado (labeling).7° a 12°: Comandas de restaurante, correos de solicitud, formularios de embarque o reclamo.Lección 4: SPEAKING (Acción Social e Interacción Oral)Dinámica clave: Juegos de rol con tarjetas de misión (Role-play cards) y brecha de información (Information Gap).Evaluación: Fluidez conversacional, fórmulas de cortesía y negociación de significado.Lección 5: MEDIATION (Habilidad Clave CEFR 2020 & MEDUCA)Dinámica clave: Facilitar la comunicación entre dos partes (ej. explicar en inglés sencillo un cartel turístico a un visitante que no entiende, o colaborar en equipo para resolver un problema compartido).3. Arquitectura de Datos para EduGen ProAntiGravity debe implementar este esquema relacional en la base de datos de EduGen Pro (PostgreSQL / Supabase / Firestore o Google Sheets API).3.1 Modelo Entidad-Relación (JSON Schema){
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EduGenProLessonPlan",
  "type": "object",
  "required": [
    "grade_id",
    "grade_name",
    "cefr_level",
    "scenario_number",
    "scenario_title",
    "lesson_number",
    "skill_focus",
    "social_scenario_context",
    "target_action_task",
    "linguistic_matrix",
    "aoa_stages"
  ],
  "properties": {
    "grade_id": { "type": "string", "enum": ["prek", "kinder", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"] },
    "grade_name": { "type": "string" },
    "cefr_level": { "type": "string", "enum": ["Pre-A1", "A1.1", "A1", "A1+", "A2", "A2+", "B1", "B1+", "B2"] },
    "scenario_number": { "type": "integer", "minimum": 1, "maximum": 8 },
    "scenario_title": { "type": "string" },
    "lesson_number": { "type": "integer", "minimum": 1, "maximum": 5 },
    "skill_focus": { "type": "string", "enum": ["Listening", "Reading", "Writing", "Speaking", "Mediation"] },
    "duration_minutes": { "type": "integer", "default": 45 },
    "social_scenario_context": { "type": "string" },
    "target_action_task": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "student_role": { "type": "string" },
        "tangible_deliverable": { "type": "string" }
      },
      "required": ["title", "student_role", "tangible_deliverable"]
    },
    "linguistic_matrix": {
      "type": "object",
      "properties": {
        "target_vocabulary": { "type": "array", "items": { "type": "string" } },
        "grammatical_structures": { "type": "array", "items": { "type": "string" } },
        "realia_photo_prompts": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "item_name": { "type": "string" },
              "image_query": { "type": "string" },
              "spatial_or_action_cue": { "type": "string" }
            }
          }
        }
      },
      "required": ["target_vocabulary", "grammatical_structures", "realia_photo_prompts"]
    },
    "aoa_stages": {
      "type": "object",
      "required": ["stage1_warmup", "stage2_presentation", "stage3_practice", "stage4_production", "stage5_assessment", "stage6_reflection"],
      "properties": {
        "stage1_warmup": { "$ref": "#/definitions/AoaStage" },
        "stage2_presentation": { "$ref": "#/definitions/AoaStage" },
        "stage3_practice": { "$ref": "#/definitions/AoaStage" },
        "stage4_production": { "$ref": "#/definitions/AoaStage" },
        "stage5_assessment": { "$ref": "#/definitions/AoaStage" },
        "stage6_reflection": { "$ref": "#/definitions/AoaStage" }
      }
    }
  },
  "definitions": {
    "AoaStage": {
      "type": "object",
      "required": ["stage_number", "stage_name", "time_allocation", "teacher_instructions", "student_action_tpr", "materials"],
      "properties": {
        "stage_number": { "type": "integer" },
        "stage_name": { "type": "string" },
        "time_allocation": { "type": "string" },
        "teacher_instructions": { "type": "string" },
        "student_action_tpr": { "type": "string" },
        "sample_language": { "type": "string" },
        "differentiation_struggling": { "type": "string" },
        "differentiation_advanced": { "type": "string" },
        "materials": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
4. Estructura de Integración con Google SheetsPara los colegios o docentes que gestionan su currículo en la nube mediante hojas de cálculo, el libro maestro debe estructurarse en 3 pestañas sincronizadas:Pestaña 1: Curriculum_Index (Metadatos Generales)Grade_Code (ej: KND, 07G, 11G)CEFR_Level (ej: Pre-A1, A2+, B1)Scenario_ID (SC01 a SC08)Scenario_Name (ej: "Where Is It?", "Mercado del Marisco", "Panama Canal ACP")Lesson_Type (Listening, Reading, Writing, Speaking, Mediation)Pestaña 2: Lesson_Stages_Detail (Contenido de los 6 Pasos AOA)Lesson_UID (Clave foránea: ej. KND_SC01_L1)Stage_Number (1 a 6)Stage_Title (Warm-up, Presentation, Practice, Production, Assessment, Reflection)Time_MinutesTeacher_Verbal_CommandExpected_Student_ActionPhoto_Asset_URL (Enlace directo a imagen real en Drive o CDN)Differentiation_NotePestaña 3: Assessment_Checklist (Rúbricas MEDUCA)Lesson_UIDCriterion_Name (Task Completion, Accuracy, Interaction, Vocabulary)Observable_Descriptor (Indicador medible en aula)Weight_Percentage5. Especificación del Motor Generativo de IA (Gemini Engine)AntiGravity debe implementar este System Prompt maestro en el servicio backend de EduGen Pro (/api/generate-aoa-lesson)."""
EDUGEN PRO - SYSTEM PROMPT DEL MOTOR AOA MEDUCA
Configuración para Gemini 3 Flash / Vertex AI
"""

SYSTEM_PROMPT = """
Eres el Diseñador Curricular Jefe de Inglés para el Ministerio de Educación de Panamá (MEDUCA) integrado en la plataforma EduGen Pro.
Tu tarea es generar o perfeccionar unidades didácticas bajo el Enfoque Orientado a la Acción (AOA) alineadas estrictamente con el Marco Común Europeo de Referencia (CEFR).

DEBES CUMPLIR ESTAS REGLAS OBLIGATORIAS:
1. ADAPTACIÓN EVOLUTIVA:
   - Si el grado es Pre-K o Kinder: El alumno NO escribe ni lee textos complejos. Todo el aprendizaje ocurre mediante escucha (Listening), movimientos físicos (TPR), gestos (pulgar arriba/abajo, asentir/negar), señalamiento de fotos reales y manipulación de objetos concretos del aula.
   - Si el grado es 7mo a 9no (Pre-Media): Las actividades son situacionales en Panamá (compras en el mercado, trámites de metro, oficios técnicos).
   - Si el grado es 10mo a 12mo (Media): Las actividades exigen argumentación, mediación intercultural y entregables sociolaborales tangibles.

2. LAS 6 ETAPAS AOA MEDUCA:
   - Etapa 1 (Warm-up / Pre-task): Activación del esquema, juego rompehielo contextual, conexión con saberes previos.
   - Etapa 2 (Presentation): Input situacional estructurado, modelado docente y chequeo conceptual (CCQs).
   - Etapa 3 (Practice): Precisión guiada, brecha de información o dinámicas de búsqueda sin sobrecarga cognitiva.
   - Etapa 4 (Production / Action Task): El estudiante como AGENTE SOCIAL realizando una tarea del mundo real con producto entregable.
   - Etapa 5 (Assessment): Evaluación formativa MEDUCA con indicadores observables concretos.
   - Etapa 6 (Reflection): Metacognición con descriptores 'Can-Do' y cierre interactivo.

3. CONTEXTO PANAMEÑO:
   - Utiliza referencias culturales y geográficas auténticas de Panamá (Balboa/USD, metro de Panamá, Mercado del Marisco, Canal de Panamá, Bocas del Toro, fauna y flora local).

4. SALIDA:
   - Genera ÚNICAMENTE JSON válido bajo el esquema EduGenProLessonPlan.
"""
6. Pasos de Implementación para el Agente AntiGravityAntiGravity debe ejecutar la implementación en EduGen Pro siguiendo estas 4 fases de ingeniería:Fase 1: Enrutamiento y Módulo de Recursos en el FrontendEn la barra de navegación de EduGen Pro, ubicar el módulo Recursos Pedagógicos > Planificador AOA.Crear un selector en cascada (Cascade Dropdown):Paso A: Grado (Pre-K hasta 12th Grade).Paso B: Escenario (Escenario 1 al 8, con el título curricular oficial).Paso C: Habilidad (1. Listening, 2. Reading, 3. Writing, 4. Speaking, 5. Mediation).Al seleccionar la combinación, la interfaz despliega los 6 paneles interactivos de las etapas AOA correspondientes.Fase 2: Pipeline de Generación de Fichas con Imágenes Reales (Worksheet Studio)Integrar el componente de renderizado HTML/Print que previsualiza la ficha del estudiante en formato estándar Carta (Letter).Cada ficha debe contar con:Membrete oficial de MEDUCA.4 a 6 tarjetas con fotografías reales en alta definición (evitar dibujos abstractos para mantener el anclaje al mundo real).Espacios de acción no verbal para Preescolar (recuadros de 👍 / 👎, casillas de verificación de apuntar) o tablas de entregable para secundaria (recibos, formularios, diagramas).Rúbrica formativa MEDUCA observable al pie para el registro docente.Fase 3: Conector de Automatización Google Sheets / DriveImplementar un Webhook o script Apps Script en el módulo que permita al docente:Exportar la lección completa a una hoja de Google Sheets con las columnas estandarizadas.Generar un documento de Google Docs y un archivo PDF en su carpeta de Google Drive con un solo clic.Fase 4: Pruebas de Validación de ContenidoProbar el flujo completo con la lección de Kindergarten procesada hoy:Grado: Kinder · Escenario: "Where Is It?" · Lección 1: Listening · CEFR: Pre-A1.Resultado verificado: Generación de ficha con fotos de útiles escolares (book, desk, chair, bag, pencil, crayon) y preposiciones espaciales (on, under, in, next to).Probar con un grado intermedio:Grado: 7mo · Escenario: "Mercado del Marisco" · Lección 4: Speaking · CEFR: A1+.Resultado verificado: Rol de turista y vendedor con presupuesto de $15.00 y orden de ceviche/corvina frita.7. Criterios de Aceptación del Entregable (Definition of Done)[x] Toda lección generada contiene las 6 etapas AOA identificadas y cronometradas.[x] Las lecciones de Kindergarten/Pre-K no exigen producción escrita compleja y priorizan TPR / fotos reales.[x] Las 5 lecciones de cada escenario desarrollan de manera diferenciada las 5 macro-habilidades lingüísticas.[x] Los archivos exportados son compatibles con impresión directa en PDF tamaño Carta (8.5 × 11 pulgadas) y edit