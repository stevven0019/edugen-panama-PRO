// Pedagogical Assistant Service for EduGen Panama ("AI English Panama")
// Handles intelligent responses for curriculum planning, MEDUCA alignment, and general EFL AI queries.

const getApiKey = () => {
  const k = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || null;
  return k && k !== 'your_gemini_api_key' && k.trim() !== '' ? k : null;
};

export const QUICK_QUESTIONS = [
  {
    id: 'about',
    label: '¿Qué hace esta página?',
    icon: '✨',
    query: '¿Qué hace esta página y cómo me ayuda como docente de inglés?'
  },
  {
    id: 'lesson_plan',
    label: '¿Cómo hacer un Lesson Plan?',
    icon: '📝',
    query: '¿Cómo se crea un Lesson Plan AOA paso a paso en EduGen?'
  },
  {
    id: 'theme_planner',
    label: '¿Cómo hacer un Theme Planner?',
    icon: '📅',
    query: '¿Cómo funciona el Theme Planner y cómo dosificar el trimestre?'
  },
  {
    id: 'workbooks',
    label: '¿Cómo hacer actividades y talleres?',
    icon: '🧩',
    query: '¿Cómo se hacen las actividades y talleres (workbooks) con Realia y preposiciones?'
  },
  {
    id: 'interdisciplinary',
    label: '¿Proyectos Interdisciplinarios?',
    icon: '🔬',
    query: '¿Cómo crear un Proyecto Interdisciplinario con el formato de MEDUCA?'
  },
  {
    id: 'export',
    label: '¿Cómo exportar a Word o PDF?',
    icon: '📄',
    query: '¿Cómo exportar los planes y actividades a Word (.docx) o PDF?'
  },
  {
    id: 'kinder_prepositions',
    label: 'Preposiciones y Realia en Kínder',
    icon: '🧸',
    query: '¿Qué preposiciones de lugar y objetos de Realia hay para Kínder y Pre-Kínder?'
  }
];

export const KNOWLEDGE_BASE = {
  about: `### 🦉 Bienvenido a EduGen Panama PRO
**EduGen Panama** es la primera plataforma SaaS de inteligencia pedagógica diseñada exclusivamente para docentes de inglés (**EFL**) de la República de Panamá.

#### 🎯 ¿Qué hace la plataforma?
* **Alineación Oficial 100% con MEDUCA:** Cumple con las matrices curriculares y lineamientos metodológicos del Ministerio de Educación de Panamá y el Marco Común Europeo de Referencia (**MCER / CEFR** desde Pre-A1 hasta B2).
* **Cobertura Total de 14 Grados:**
  * Educación Inicial: **Pre-Kínder y Kínder**.
  * Educación Primaria: **1° a 6° Grado**.
  * Pre-Media: **7°, 8° y 9° Grado**.
  * Educación Media: **10°, 11° y 12° Grado**.
* **Enfoque Orientado a la Acción (AOA - Action-Oriented Approach):** Los estudiantes aprenden utilizando el idioma como agentes sociales para resolver tareas del mundo real.
* **Módulos Principales:**
  1. **Lesson Planner AOA:** Secuencias didácticas semanales en 3 fases (*Warm-up, Pre-task, Task Execution, Post-task*) con rúbrica integrada.
  2. **Theme Planner:** Planificador y dosificación trimestral con metas comunicativas e indicadores oficiales.
  3. **Actividades Didácticas y Workbooks:** Fichas de pareo con más de 1,000 objetos reales (*Realia*), preposiciones espaciales, sopas de letras, crucigramas y diálogos.
  4. **Proyectos Interdisciplinarios:** Vinculación de inglés con Ciencias, Español, Sociales y Matemáticas bajo el formato oficial de MEDUCA.
  5. **Exportación Inmediata:** Descarga en Word (.docx) editable con membrete institucional y PDF listo para imprimir.`,

  lesson_plan: `### 📝 Guía: Cómo crear un Lesson Plan AOA en EduGen

El **Planificador AOA** genera secuencias didácticas semanales rigurosas y listas para el aula:

#### Paso 1: Selecciona el Nivel y Trimestre
* En el menú lateral, haz clic en **Planificador AOA**.
* Selecciona tu grado escolar (desde Pre-Kínder hasta 12° Grado) y el trimestre lectivo (I, II o III Trimestre).

#### Paso 2: Escoge el Escenario Oficial
* Selecciona el **Tema** y el **Escenario Comunicativo** predefinido por MEDUCA (ej. *My Classroom, Healthy Living, Panama Tourism, Technology*).
* Elige las habilidades a trabajar: *Listening, Speaking, Reading, Writing*.

#### Paso 3: Generación Inteligente
* Presiona **"Generar Lesson Plan AOA"**. La IA redactará automáticamente la secuencia didáctica:
  * **Warm-up / Activation:** Dinámica lúdica para enganchar a los estudiantes y activar conocimientos previos.
  * **Pre-task (Preparation):** Presentación de vocabulario contextualizado con Realia, pronunciación y modelos de estructuras gramaticales.
  * **Task Execution:** La tarea comunicativa central en parejas o grupos pequeños (simulación, entrevista, creación de menú, debate).
  * **Post-task / Assessment:** Cierre reflexivo, autoevaluación, coevaluación y evidencias de logro.

#### Paso 4: Descarga en Word (.docx) o PDF
* Revisa y edita los textos si lo deseas.
* Haz clic en **Descargar Word (.docx)** para obtener el documento oficial con tablas y membrete de MEDUCA, o **Exportar a PDF** para imprimirlo de inmediato.`,

  theme_planner: `### 📅 Guía: Cómo hacer un Theme Planner (Dosificación Trimestral)

El **Theme Planner** te ahorra días de trabajo administrativo organizando la planeación trimestral:

#### Paso 1: Ingresa a Theme Planner
* Ve a la sección **Theme Planner** en el menú de la aplicación.

#### Paso 2: Selecciona Grado y Trimestre
* Escoge el grado (ej. 4° Grado de Primaria o 11° de Media) y el trimestre que vas a planificar.

#### Paso 3: Carga Curricular Automática
* El sistema extrae de forma instantánea el programa oficial de MEDUCA:
  * **Escenarios comunicativos** sugeridos para ese período.
  * **Metas comunicativas (Communicative Aims).**
  * **Descriptores de desempeño e indicadores de logro** correspondientes al nivel CEFR.
  * **Vocabulario y gramática funcional** clave.

#### Paso 4: Distribuye las Semanas y Horas
* Puedes ajustar cuántas semanas dedicarás a cada escenario según el calendario escolar de tu centro.
* Presiona **Generar Plan Trimestral** para consolidar la matriz.
* Exporta la dosificación en **Word (.docx)** editable para entregarla a la dirección o coordinación docente.`,

  workbooks: `### 🧩 Guía: Cómo generar Actividades y Talleres (Workbooks)

EduGen incluye un generador de material didáctico imprimible e interactivo:

#### 1. Tipos de Actividades Disponibles
* **Pareo con Realia Visual:** Más de **1,000 imágenes de objetos reales** clasificados (útiles escolares, animales, muebles, juguetes, alimentos).
* **Tarjetas Espaciales de Preposiciones (Kínder / Primaria):** Ilustraciones interactivas para practicar *in, on, under, next to, behind, in front of, between, over* con objetos cotidianos como sillas, mesas y cajas.
* **Word Search (Sopa de Letras):** Genera cuadrículas automáticas con las palabras clave del escenario.
* **Crossword (Crucigrama):** Pistas comunicativas diseñadas según la edad del estudiante.
* **Fill-in-the-blanks:** Oraciones para completar con banco de palabras y apoyo de imágenes.
* **Listening Scripts:** Guiones de diálogos naturales con preguntas de comprensión.

#### 2. Cómo crearlas
* En el módulo del **Planificador AOA**, desplázate a la sección **Actividades Didácticas**.
* Selecciona el tipo de taller que deseas para la lección.
* Personaliza o genera con IA los ejercicios.
* Imprime directamente o descárgalas en la ficha de trabajo del estudiante.`,

  interdisciplinary: `### 🔬 Guía: Cómo crear Proyectos Interdisciplinarios MEDUCA

EduGen implementa el formato oficial de la **Guía de Aprendizajes Interdisciplinarios** de MEDUCA:

#### Paso 1: Accede a "Interdisciplinario"
* Abre la pestaña **Interdisciplinario** en la barra lateral.

#### Paso 2: Configuración Inicial
* Escribe el Centro Educativo, Región Educativa (ej. Panamá Centro, Chiriquí, Colón), Grado y Docente(s).
* Selecciona las asignaturas articuladoras (ej. **Inglés + Ciencias Naturales + Español + Matemáticas**).

#### Paso 3: Plantea el Problema o Eje Comunitario
* Introduce un tema de interés para los estudiantes (ej. *El manejo de desechos y reciclaje en nuestro colegio*, *El cuidado del agua*, *La diversidad cultural de Panamá*).

#### Paso 4: Generación y Resultados
* Presiona **Generar Proyecto Interdisciplinario**. La IA estructurará:
  * Título atractivo y Pregunta Esencial de indagación.
  * Justificación pedagógica basada en competencias para el siglo XXI.
  * Red de asignaturas con sus aportes específicos al proyecto.
  * Plan semanal de 4 semanas con entregables y producto final.
  * Rúbrica de evaluación formativa y sumativa.
* Puedes descargarlo en **Word (.docx)** con las tablas oficiales del Ministerio.`,

  export: `### 📄 Guía: Exportación a Word (.docx) y PDF

Todos los módulos de EduGen te permiten guardar y llevar tu material al aula:

* **Descargar Word (.docx):**
  * Genera un archivo `.docx` nativo compatible con Microsoft Word, Google Docs y LibreOffice.
  * Incluye el membrete institucional oficial de MEDUCA, tablas formateadas con colores y márgenes profesionales.
  * Es 100% editable para que agregues tu nombre, sello o ajustes personales.
* **Exportar PDF / Imprimir:**
  * Formato listo para impresión en hojas estándar (Carta / A4).
  * Ideal para fotocopiar talleres, sopas de letras y exámenes para los estudiantes.
* **Biblioteca Digital:**
  * Todo lo que generas queda automáticamente guardado en tu pestaña **Biblioteca** para que puedas recuperarlo en cualquier momento.`,

  kinder_prepositions: `### 🧸 Preposiciones de Lugar y Realia en Kínder y Pre-Kínder

En la última actualización de EduGen Panama, enriquecimos profundamente los escenarios de **Pre-Kínder y Kínder**:

#### 📍 Preposiciones de Lugar Integradas
* **in** (dentro de): *The pencil is in the box.*
* **on** (sobre / encima de): *The book is on the table.*
* **under** (debajo de): *The cat is under the chair.*
* **next to** (al lado de): *The backpack is next to the chair.*
* **behind** (detrás de): *The ball is behind the desk.*
* **in front of** (delante de): *The puppy is in front of the door.*
* **between** (entre): *The apple is between the books.*
* **over / near** (sobre / cerca de): *The clock is over the board.*

#### 🪑 Objetos de Aula y Realia Disponibles
* **Chair** (Silla) - Con imágenes reales añadidas.
* **Desk & Table** (Escritorio y Mesa).
* **Backpack, Pencil, Crayon, Sharpener, Eraser, Box, Ruler**.
* Todas cuentan con tarjetas visuales interactivas para que los niños pequeños señalen, manipulen y asocien el lenguaje con el objeto real.`
};

export function getFallbackPedagogicalResponse(query) {
  const q = (query || '').toLowerCase().trim();

  if (q.includes('qué hace') || q.includes('que hace') || q.includes('para qué sirve') || q.includes('para que sirve') || q.includes('edugen') || q.includes('esta página') || q.includes('esta pagina')) {
    return KNOWLEDGE_BASE.about;
  }
  if (q.includes('lesson plan') || q.includes('secuencia') || q.includes('planificador aoa') || q.includes('clase') || (q.includes('cómo') && q.includes('plan'))) {
    return KNOWLEDGE_BASE.lesson_plan;
  }
  if (q.includes('theme planner') || q.includes('trimestral') || q.includes('dosificación') || q.includes('dosificacion') || q.includes('anual')) {
    return KNOWLEDGE_BASE.theme_planner;
  }
  if (q.includes('actividad') || q.includes('workbook') || q.includes('taller') || q.includes('ficha') || q.includes('sopa') || q.includes('crucigrama')) {
    return KNOWLEDGE_BASE.workbooks;
  }
  if (q.includes('interdisciplinario') || q.includes('proyecto') || q.includes('integracion') || q.includes('ciencias')) {
    return KNOWLEDGE_BASE.interdisciplinary;
  }
  if (q.includes('exportar') || q.includes('word') || q.includes('pdf') || q.includes('descargar') || q.includes('docx') || q.includes('imprimir')) {
    return KNOWLEDGE_BASE.export;
  }
  if (q.includes('preposicion') || q.includes('preposition') || q.includes('kinder') || q.includes('chair') || q.includes('silla') || q.includes('under') || q.includes('next to')) {
    return KNOWLEDGE_BASE.kinder_prepositions;
  }

  // General conversational AI response
  return `### 🦉 Asesor Curricular AI English Panama
¡Hola! Soy tu asistente pedagógico de **EduGen Panama**. Estoy capacitado para asesorarte en cualquier aspecto de la enseñanza del inglés y la planificación con el currículo de MEDUCA.

**Aspectos clave para tus clases:**
* **Enfoque Orientado a la Acción (AOA):** El aprendizaje debe centrarse en tareas donde el estudiante use el inglés para comunicarse de forma real (no solo memorizar reglas gramaticales).
* **Andamiaje Progresivo:** Te recomiendo siempre comenzar con una activación (*Warm-up*), presentar el vocabulario con objetos reales (*Pre-task*), ejecutar la tarea en parejas (*Task*) y cerrar con co-evaluación (*Post-task*).
* **Material Concreto (Realia):** En los primeros grados, el uso de imágenes reales (sillas, mesas, útiles, juguetes) y tarjetas de preposiciones aceleran la comprensión oral.

**Preguntas rápidas disponibles:**
* *¿Qué hace esta página?*
* *¿Cómo hacer un Lesson Plan AOA?*
* *¿Cómo hacer un Theme Planner?*
* *¿Cómo hacer actividades y workbooks?*
* *¿Cómo crear un Proyecto Interdisciplinario?*
* *¿Cómo exportar a Word (.docx) o PDF?*

¡Pregúntame cualquier duda pedagógica o sobre el uso de la plataforma!`;
}

export async function askPedagogicalAssistant(prompt, conversationHistory = []) {
  const clientApiKey = getApiKey();
  const cleanPrompt = (prompt || '').trim();

  // Check if it's one of the instant FAQ quick queries
  const lower = cleanPrompt.toLowerCase();
  if (lower.length < 60) {
    if (lower.includes('qué hace esta página') || lower.includes('que hace esta pagina') || lower === '¿qué hace edugen panama?') {
      return KNOWLEDGE_BASE.about;
    }
    if (lower.includes('lesson plan') && (lower.includes('cómo') || lower.includes('como') || lower.includes('hacer') || lower.includes('crear'))) {
      return KNOWLEDGE_BASE.lesson_plan;
    }
    if (lower.includes('theme planner') && (lower.includes('cómo') || lower.includes('como') || lower.includes('hacer') || lower.includes('funciona'))) {
      return KNOWLEDGE_BASE.theme_planner;
    }
    if ((lower.includes('actividades') || lower.includes('workbooks')) && (lower.includes('cómo') || lower.includes('como') || lower.includes('hacer') || lower.includes('generar'))) {
      return KNOWLEDGE_BASE.workbooks;
    }
    if (lower.includes('interdisciplinario') && (lower.includes('cómo') || lower.includes('como') || lower.includes('crear') || lower.includes('proyecto'))) {
      return KNOWLEDGE_BASE.interdisciplinary;
    }
    if (lower.includes('exportar') || lower.includes('word') || lower.includes('pdf')) {
      return KNOWLEDGE_BASE.export;
    }
    if (lower.includes('preposicion') || lower.includes('kinder') || lower.includes('chair')) {
      return KNOWLEDGE_BASE.kinder_prepositions;
    }
  }

  const systemInstruction = `Eres "AI English Panama", el asesor virtual pedagógico de la plataforma EduGen Panama (www.edugenpanama.com).
Tu avatar e identidad gráfica es el búho cibernético con birrete y alas de circuitos ("AI ENGLISH PANAMA").

TU MISIÓN:
Ayudar a los docentes de inglés (EFL) en Panamá (desde Pre-Kinder hasta 12° grado) a planificar clases, entender el enfoque por tareas/acción (Action-Oriented Approach - AOA) exigido por el Ministerio de Educación de Panamá (MEDUCA), diseñar actividades, formular rúbricas, resolver dudas técnicas sobre cómo usar la plataforma EduGen Panama y ofrecer sugerencias pedagógicas de alto nivel.

CONOCIMIENTO INTEGRAL DE EDUGEN PANAMA:
1. ¿Qué es EduGen Panama?
   Es una plataforma SaaS panameña para la automatización curricular de inglés alineada 100% con los programas de MEDUCA y el Marco Común Europeo (CEFR Pre-A1 a B2) en 14 niveles (Pre-K a 12° grado).
2. Funciones Clave:
   - "Lesson Planner AOA": Secuencias didácticas semanales en 3 fases metodológicas (Warm-up, Pre-task con Realia, Task Execution comunicativa, y Post-task con evaluación formativa).
   - "Theme Planner": Dosificación trimestral con escenarios, metas comunicativas, indicadores de logro y vocabulario para los 14 grados escolares.
   - "Generador de Actividades y Workbooks": Talleres interactivos con más de 1,000 objetos reales (Realia), preposiciones espaciales (in, on, under, next to...), sopa de letras, crucigramas y diálogos auditivos.
   - "Proyectos Interdisciplinarios": Guía oficial MEDUCA para integrar inglés con Ciencias, Sociales, Español y Matemáticas.
   - "Exportación Profesional": Descargas en Word (.docx con membrete MEDUCA) y PDF imprimible.

PAUTAS DE RESPUESTA:
- Responde siempre con tono empático, cordial, pedagógicamente riguroso, motivador y profesional.
- Utiliza formato Markdown con títulos breves, listas con viñetas, pasos numerados y negritas para que la lectura sea ágil y clara.
- Responde en el idioma en que te hablen (español o inglés).
- Brinda ejemplos prácticos aplicables a las aulas panameñas cuando te pidan ideas de clase.`;

  const contents = [];
  if (conversationHistory && Array.isArray(conversationHistory)) {
    for (const msg of conversationHistory.slice(-6)) {
      if (msg.text) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: cleanPrompt }]
  });

  const body = {
    contents: contents,
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  try {
    let data;
    if (clientApiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      }
    } else {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      }
    }
  } catch (err) {
    console.warn("Pedagogical AI Gemini fetch error, falling back to knowledge base:", err);
  }

  return getFallbackPedagogicalResponse(cleanPrompt);
}
