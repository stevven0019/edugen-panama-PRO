// AI Prompt Service - Integrates Custom Prompts and Multimodal Screenshot extraction for Gemini API

const getApiKey = () => {
  const k = import.meta.env.VITE_GEMINI_API_KEY;
  return k && k !== 'your_gemini_api_key' && k.trim() !== '' ? k : null;
};

// ── Mock Generator for Demo / Simulation Mode ──
async function simulateResponse(type, vars, media = null) {
  if (type === 'inter_tema') {
    await new Promise(r => setTimeout(r, 1000));
    const cleanDesc = vars.descripcion || 'El cuidado de los recursos naturales';
    return JSON.stringify({
      tema: `Guardianes del Futuro: ${cleanDesc} en Panamá`,
      pregunta_esencial: `¿Cómo podemos promover de forma activa y práctica el desarrollo sostenible y la valoración de ${cleanDesc} en nuestro centro escolar?`,
      justificacion: `Este proyecto busca concientizar a los estudiantes de ${vars.grade || '5to Grado'} sobre la importancia del cuidado y conservación del entorno mediante la integración de diversas asignaturas, fomentando la colaboración escolar en el ${vars.trimestre || 'I Trimestre'}.`
    });
  }

  if (type === 'inter_formato') {
    await new Promise(r => setTimeout(r, 1500));
    const materiasList = vars.materias || ['Español', 'Ciencias Naturales'];
    const materiasStr = materiasList.join(', ');
    const tema = vars.temaGenerado || 'Guardianes de la Sostenibilidad';
    const grade = vars.grade || '5to Grado';
    const Escuela = vars.escuela || 'Centro Educativo República de Panamá';
    const Docente = vars.docente || 'Profa. María González';
    const Region = vars.region || 'Panamá Centro';
    const Anio = vars.anio || '2026';
    const Trimestre = vars.trimestre || 'I Trimestre';

    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px; background: #fff; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #1a1a5e; padding-bottom: 10px;">
    <p style="font-size: 14px; font-weight: bold; margin: 2px 0; color: #1a1a5e;">MINISTERIO DE EDUCACIÓN</p>
    <p style="font-size: 13px; font-weight: bold; margin: 2px 0; color: #1a1a5e;">Guía para el desarrollo de proyectos de aprendizajes interdisciplinarios</p>
    <p style="font-size: 12px; margin: 2px 0; font-weight: bold;">Dirección Regional de Educación de ${Region}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <tr>
      <td style="width: 150px; font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Centro Educativo:</td>
      <td style="border: 1px solid #333; padding: 6px;">${Escuela}</td>
      <td style="width: 150px; font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Docentes Responsables:</td>
      <td style="border: 1px solid #333; padding: 6px;">${Docente}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Título del Proyecto:</td>
      <td colspan="3" style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e; font-size: 12px;">"${tema}"</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Justificación:</td>
      <td colspan="3" style="border: 1px solid #333; padding: 6px; text-align: justify;">
        Este proyecto surge como respuesta a la necesidad de fortalecer el pensamiento crítico y la concienciación ecológica en los estudiantes de ${grade}. Mediante la integración de asignaturas como ${materiasStr}, los alumnos abordarán desafíos del mundo real específicos de nuestra comunidad panameña durante el ${Trimestre}. Esto les permitirá desarrollar competencias clave del siglo XXI y valorar su rol en el desarrollo sostenible local.
      </td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Duración Estimada:</td>
      <td style="border: 1px solid #333; padding: 6px;">4 Semanas</td>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Año Escolar:</td>
      <td style="border: 1px solid #333; padding: 6px;">${Anio}</td>
    </tr>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    1. RED DE ASIGNATURAS, GRADO Y TRIMESTRE
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #e6e6fa; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Asignaturas Participantes</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 150px;">Grado</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 150px;">Trimestre</th>
      </tr>
    </thead>
    <tbody>
      ${materiasList.map((m, idx) => `
      <tr>
        <td style="border: 1px solid #333; padding: 6px;">${idx + 1}. ${m}</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: center;">${grade}</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: center;">${Trimestre}</td>
      </tr>
      `).join('')}
      <tr>
        <td style="border: 1px solid #333; padding: 6px; font-style: italic;">Otras vinculaciones</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: center;">N/A</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: center;">N/A</td>
      </tr>
    </tbody>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    2. OBJETIVO GENERAL DEL PROYECTO
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <tr>
      <td style="border: 1px solid #333; padding: 10px; text-align: justify; background: #fafafa; font-style: italic; font-weight: bold; color: #1a1a5e;">
        Fomentar una red interdisciplinaria de aprendizaje en los estudiantes de ${grade} mediante el estudio práctico de "${tema}", promoviendo habilidades de indagación científica, razonamiento matemático y producción textual en español, con el fin de proponer soluciones ecológicas colaborativas y sustentables para el beneficio de su entorno escolar.
      </td>
    </tr>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    3. ELEMENTOS CURRICULARES INTEGRADOS
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;">
    <thead>
      <tr style="background: #e6e6fa; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 120px;">Componente</th>
        ${materiasList.map(m => `<th style="border: 1px solid #333; padding: 6px; text-align: left;">${m}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Objetivos de Aprendizaje</td>
        ${materiasList.map(m => `
        <td style="border: 1px solid #333; padding: 6px;">
          Desarrollar competencias conceptuales y actitudinales en ${m} aplicadas a la resolución de problemas sobre sostenibilidad y ecología local.
        </td>
        `).join('')}
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Indicadores de Logro</td>
        ${materiasList.map(m => `
        <td style="border: 1px solid #333; padding: 6px;">
          ● Explica la relación entre los conceptos de ${m} y los recursos de su entorno.<br>
          ● Colabora en el diseño de propuestas prácticas sobre el cuidado ambiental.
        </td>
        `).join('')}
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Contenidos Curriculares</td>
        ${materiasList.map(m => `
        <td style="border: 1px solid #333; padding: 6px;">
          Tópicos de ${m} para ${grade} relacionados con el análisis, la comunicación y la investigación de campo de fenómenos biológicos y sociales.
        </td>
        `).join('')}
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Herramientas de Apoyo</td>
        ${materiasList.map(m => `
        <td style="border: 1px solid #333; padding: 6px;">
          Presentaciones interactivas, hojas de registro digital, videos educativos.
        </td>
        `).join('')}
      </tr>
    </tbody>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    4. PLANIFICACIÓN DE LAS FASES DEL PROYECTO
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #e6e6fa; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 150px;">Fases del Proyecto</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Acciones y Actividades Clave</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold; background: #f5f5f5; border: 1px solid #333; padding: 6px;">Semana 1: Planificación</td>
        <td style="border: 1px solid #333; padding: 6px;">
          Presentación del tema generador a los estudiantes, lluvia de ideas sobre la pregunta esencial y delimitación de equipos de trabajo. Organización del cronograma escolar.
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f5f5f5; border: 1px solid #333; padding: 6px;">Semana 2: Ejecución (Indagación)</td>
        <td style="border: 1px solid #333; padding: 6px;">
          Investigación bibliográfica y recopilación de datos locales sobre el problema ambiental. Elaboración de tablas e informes informales por cada asignatura integrada.
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f5f5f5; border: 1px solid #333; padding: 6px;">Semana 3: Desarrollo de Producto</td>
        <td style="border: 1px solid #333; padding: 6px;">
          Construcción de la propuesta ambiental práctica (campaña escolar, maqueta, recolector de agua, etc.). Redacción de instructivos y materiales de divulgación.
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f5f5f5; border: 1px solid #333; padding: 6px;">Semana 4: Cierre y Socialización</td>
        <td style="border: 1px solid #333; padding: 6px;">
          Exposición escolar del proyecto final en una feria científica escolar. Evaluación formativa y sumativa cruzada entre asignaturas. Autoevaluación del equipo.
        </td>
      </tr>
    </tbody>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    5. CRONOGRAMA DE ACTIVIDADES
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; text-align: center;">
    <thead>
      <tr style="background: #e6e6fa; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Actividades Principales</th>
        <th style="border: 1px solid #333; padding: 6px; width: 60px;">Semana 1</th>
        <th style="border: 1px solid #333; padding: 6px; width: 60px;">Semana 2</th>
        <th style="border: 1px solid #333; padding: 6px; width: 60px;">Semana 3</th>
        <th style="border: 1px solid #333; padding: 6px; width: 60px;">Semana 4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">1. Sensibilización y conformación de equipos</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">2. Investigación de campo y recogida de datos</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">3. Análisis matemático e integrador de resultados</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">4. Elaboración física de prototipos / propuestas</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">5. Redacción de informes y preparación de paneles</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; text-align: left;">6. Presentación en plenaria y evaluación cruzada</td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px;"></td>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold; color: #1a1a5e;">X</td>
      </tr>
    </tbody>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    6. EVALUACIÓN Y CRITERIOS DEL APRENDIZAJE
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <tr>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px; width: 180px;">Instrumentos Sugeridos:</td>
      <td style="border: 1px solid #333; padding: 6px; text-align: justify;">
        Rúbrica integradora de proyecto, lista de cotejo para el trabajo en equipo, escala de estimación para la exposición del mural interactivo y portafolio de evidencias.
      </td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f0f0f0; border: 1px solid #333; padding: 6px;">Criterios de Evaluación:</td>
      <td style="border: 1px solid #333; padding: 6px; text-align: justify;">
        ● <b>Puntualidad e Integración:</b> Muestra compromiso grupal e integra las directrices de las asignaturas participantes.<br>
        ● <b>Claridad Conceptual:</b> Aplica conceptos científicos, gramaticales y matemáticos con precisión en el diseño del producto.<br>
        ● <b>Creatividad y Utilidad:</b> El producto final responde a una necesidad del entorno escolar de forma original.
      </td>
    </tr>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    7. REFERENCIAS BIBLIOGRÁFICAS (APA)
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <tr>
      <td style="border: 1px solid #333; padding: 10px; text-align: justify; background: #fafafa; font-style: italic;">
        1. Ministerio de Educación de Panamá. (2023). <i>Programas de Educación Básica General: Segundo Ciclo</i>. MEDUCA.<br>
        2. UNESCO. (2020). <i>Educación para el Desarrollo Sostenible: Objetivos de Aprendizaje</i>. UNESCO Publishing.<br>
        3. Hernández-Sampieri, R. (2018). <i>Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta</i>. McGraw-Hill.<br>
        4. Smith, J. & López, A. (2022). <i>Active Learning Strategies in primary schools of Latin America</i>. Journal of Curriculum Studies, 45(2), 112-128.
      </td>
    </tr>
  </table>

  <div style="background: #1a1a5e; color: white; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 15px;">
    8. OBSERVACIONES PEDAGÓGICAS
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px;">
    <tr>
      <td style="border: 1px solid #333; padding: 10px; text-align: justify;">
        Se recomienda realizar adecuaciones curriculares significativas para aquellos estudiantes con necesidades educativas especiales, apoyando con andamios visuales y tiempos diferenciados en las fases de ejecución y exposición. Se sugiere promover la participación voluntaria de padres de familia en la feria escolar.
      </td>
    </tr>
  </table>

  <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 10px; font-family: Arial, sans-serif;">
    <div style="width: 30%; border-top: 1px solid #333; padding-top: 5px; text-align: center;">
      <p style="font-weight: bold; margin: 2px 0;">Docente Responsable</p>
      <p style="margin: 2px 0;">${Docente}</p>
    </div>
    <div style="width: 30%; border-top: 1px solid #333; padding-top: 5px; text-align: center;">
      <p style="font-weight: bold; margin: 2px 0;">Coordinación Pedagógica</p>
      <p style="margin: 2px 0;">Firma y Fecha</p>
    </div>
    <div style="width: 30%; border-top: 1px solid #333; padding-top: 5px; text-align: center;">
      <p style="font-weight: bold; margin: 2px 0;">Dirección del Centro</p>
      <p style="margin: 2px 0;">Firma y Sello</p>
    </div>
  </div>
</div>
    `;
  }

  if (type === 'planner') {
    await new Promise(r => setTimeout(r, 1500));
    const cleanTheme = vars.theme || 'Healthy Eating';
    const cleanScenario = vars.scenario || 'At the local supermarket';
    const cleanSkills = vars.skills?.join(', ') || 'Reading, Speaking';
    const cleanGrade = vars.grade || '5th Grade';
    const cleanObjective = vars.objective || `By the end of the lesson, students will be able to communicate key concepts about ${cleanTheme} inside ${cleanScenario}.`;
    const cleanOutcome = vars.outcome || `Students will perform dialogues using target expressions.`;
    const lessonNum = vars.lessonNum || 1;

    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px; background: #fff; border-radius: 8px;">
  <div style="background: #1a5276; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0; font-size: 18px;">Lesson Planner – Theme: ${cleanTheme} – Lesson # ${lessonNum}</h2>
    <p style="margin: 5px 0 0 0; font-size: 11px; font-style: italic;">Complete this planner five times per theme, once per lesson (Lesson 1 through Lesson 5).</p>
  </div>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px dashed #333; font-size: 11px;">
    <tr>
      <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; width: 50%;">Lesson #: ${lessonNum}</td>
      <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; width: 50%;">Skills Focus: ${cleanSkills}</td>
    </tr>
    <tr>
      <td style="border: 1px dashed #333; padding: 8px; font-weight: bold;">Grade: ${cleanGrade}</td>
      <td style="border: 1px dashed #333; padding: 8px; font-weight: bold;">Scenario: ${cleanScenario}</td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px dashed #333; padding: 8px; font-weight: bold;">Theme: ${cleanTheme}</td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px dashed #333; padding: 8px; text-align: justify;">
        <span style="font-weight: bold; color: #1a5276; display: block; margin-bottom: 4px;">Specific Objective:</span>
        ${cleanObjective}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px dashed #333; padding: 8px; text-align: justify;">
        <span style="font-weight: bold; color: #1a5276; display: block; margin-bottom: 4px;">Learning Outcome:</span>
        ${cleanOutcome}
      </td>
    </tr>
  </table>

  <h3 style="color: #1a5276; border-bottom: 2px solid #1a5276; padding-bottom: 5px; margin-top: 20px;">The Six Action-Oriented Approach (AOA) Lesson Stages</h3>
  <table style="width: 100%; border-collapse: collapse; border: 1px dashed #333; font-size: 11px;">
    <thead>
      <tr style="background: #f0f0f0;">
        <th style="border: 1px dashed #333; padding: 8px; text-align: left; width: 200px;">Stage & Description</th>
        <th style="border: 1px dashed #333; padding: 8px; text-align: left;">Activities & Teacher Actions</th>
        <th style="border: 1px dashed #333; padding: 8px; text-align: center; width: 100px;">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 1: Warm-up / Pre-task<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Engagement, Modeling, Clarification</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Warm-up:</b> El docente inicia la clase mostrando imágenes reales y coloridas sobre <i>"${cleanTheme}"</i>. Realiza preguntas de enganche como <i>"Do you like this?"</i> o <i>"Have you seen this in your community?"</i> para activar conocimientos previos.<br><br>
          <b>Modeling:</b> El docente escribe 5 palabras clave de vocabulario en el tablero (relacionadas con <i>"${cleanTheme}"</i>) y modela la pronunciación correcta en inglés en forma coral e individual, asegurándose de destacar sonidos difíciles.<br><br>
          <b>Clarification (CCQs):</b> Para verificar la comprensión, el docente realiza preguntas de verificación de concepto (CCQs), por ejemplo: <i>"Is this an action word or a naming word?"</i>, <i>"Do we do this in the morning or at night?"</i>, asegurando que todos comprendan el significado real antes de avanzar.
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">10 mins</td>
      </tr>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 2: Presentation<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Input and Context Connection</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Material / Input:</b> Se introduce un diálogo corto impreso entre dos personajes (e.g. "Ana y Carlos") ambientado en el escenario: <i>"${cleanScenario}"</i>.<br><br>
          <b>Competencia Comunicativa:</b> Comprensión escrita y oral sobre descripciones y preferencias básicas del tema <i>"${cleanTheme}"</i>.<br><br>
          <b>Actividades:</b> Los estudiantes leen el diálogo de forma de lectura compartida. Subrayan las palabras del vocabulario que reconocen de la Etapa 1. Responden 3 preguntas rápidas de Verdadero o Falso sobre el texto para evaluar la comprensión global.
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">15 mins</td>
      </tr>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 3: Preparation / Practice<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Accuracy-focused Activities</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Enfoque de Precisión (${cleanSkills}):</b> Práctica guiada estructurada para asegurar la correcta pronunciación y estructura gramatical.<br><br>
          <b>Habilidad Comunicativa / Contenido:</b> Interacción oral y escrita utilizando expresiones clave del tema.<br><br>
          <b>Procedimiento Detallado:</b><br>
          1. <b>Completación:</b> Los estudiantes completan una ficha con 6 oraciones de llenar espacios usando las estructuras gramaticales del día.<br>
          2. <b>Sustitución en cadena:</b> En parejas, sustituyen palabras clave del diálogo modelo por opciones personales (e.g., cambiar el tipo de elemento o lugar).<br>
          3. <b>Práctica oral controlada:</b> Leen las oraciones completadas en voz alta a su compañero para corregir entonación bajo el monitoreo constante del docente.
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">15 mins</td>
      </tr>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 4: Performance / Production<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Fluency-focused Communicative Task</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Tarea de Desempeño:</b> Los estudiantes realizan un juego de roles (Role-play) simulando la situación del escenario real: <i>"${cleanScenario}"</i>.<br><br>
          <b>Instrucciones:</b> En parejas, deben crear una conversación original de al menos 4 turnos cada uno utilizando las frases aprendidas. Por ejemplo, actuar como comprador y vendedor en <i>"${cleanScenario}"</i>.<br><br>
          <b>Enfoque de Fluidez:</b> Se prioriza la comunicación y la resolución de la tarea por encima de la corrección gramatical estricta. El docente circula y anota fortalezas y errores comunes sin interrumpir el flujo.
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">15 mins</td>
      </tr>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 5: Assessment / Post-task<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Formative Assessment & Evidence</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Estrategia de Evaluación Formativa:</b> Lista de cotejo de desempeño oral durante el juego de roles de la Etapa 4.<br><br>
          <b>Criterios Evaluados:</b> Uso de vocabulario clave de <i>"${cleanTheme}"</i>, pronunciación inteligible de las oraciones y colaboración en parejas.<br><br>
          <b>Autoevaluación:</b> Los estudiantes completan un "Ticket de Salida" (Exit Ticket) respondiendo: <i>"Una palabra nueva que usé hoy es..."</i> y marcan una escala visual sobre cómo se sintieron hablando inglés.
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">10 mins</td>
      </tr>
      <tr>
        <td style="border: 1px dashed #333; padding: 8px; font-weight: bold; color: #1a5276; vertical-align: top;">
          Stage 6: Reflection<br>
          <span style="font-size: 9px; font-weight: normal; color: #555;">Student & Teacher Reflection</span>
        </td>
        <td style="border: 1px dashed #333; padding: 8px;">
          <b>Reflexión del Estudiante:</b> Los alumnos responden oralmente a las preguntas: <i>"¿Qué aprendí hoy en clase?"</i> y <i>"¿Cuál actividad me costó más trabajo?"</i>.<br><br>
          <b>Reflexión del Docente:</b> Evaluar si el tiempo asignado fue suficiente y ajustar el andamiaje visual (sentence frames) en la pizarra para la siguiente lección (Lección ${lessonNum + 1} de 5).
        </td>
        <td style="border: 1px dashed #333; padding: 8px; text-align: center; vertical-align: middle;">5 mins</td>
      </tr>
    </tbody>
  </table>
  
  <div style="border: 1px dashed #333; padding: 10px; margin-top: 15px; font-size: 10px;">
    <p style="margin: 2px 0;">📝 <b>Homework:</b> Review the class vocab sheet and write 3 sentences detailing a personal connection to "${cleanTheme}".</p>
    <p style="margin: 2px 0;">📊 <b>Formative Assessment:</b> Oral presentation checklist based on Stage 4 performance.</p>
    <p style="margin: 2px 0;">💬 <b>Teacher's Notes:</b> Ensure scaffolds are available for students needing additional pronunciation support.</p>
  </div>
</div>
    `;
  }

  if (type === 'delivery') {
    await new Promise(r => setTimeout(r, 1500));
    const cleanTheme = vars.theme || 'Healthy Eating';
    const cleanScenario = vars.scenario || 'At the local supermarket';
    const cleanSkills = vars.skills?.join(', ') || 'Reading, Speaking';
    const cleanGrade = vars.grade || '5th Grade';

    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px; background: #fff; border-radius: 8px;">
  <div style="background: #1a5276; color: white; padding: 15px; text-align: center; border-radius: 8px;">
    <h2 style="margin: 0; font-size: 16px;">GUÍA DE ENTREGA PEDAGÓGICA (AOA) - MEDUCA</h2>
    <p style="margin: 5px 0 0 0; font-size: 11px;">Indicaciones y guiones para la lección N° ${vars.lessonNum || 1}</p>
  </div>

  <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 20px 0 10px 0;"></div>
  <div style="background-color:#1a5276; color:white; padding:10px 15px; font-size:14px; font-weight:bold; border-radius:4px;">
       🎯 ETAPA 1: WARM-UP / PRE-TASK | Tiempo: 10 min
  </div>
  <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border: 1px solid #aab7b8; font-size:11px;">
    <tr style="background-color:#d6eaf8; font-weight:bold;">
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👨‍🏫 ROL DEL MAESTRO</td>
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👩‍🎓 ROL DEL ESTUDIANTE</td>
    </tr>
    <tr>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📋 Preparación:</b> Flashcards de ${cleanTheme}.<br>
        <b>🗣️ Guión:</b> <i>"Hello class! Look at this picture. What do you see? Is it healthy or unhealthy?"</i><br>
        <b>🎬 Acción:</b> Muestra imágenes rápidas e introduce pronunciación coral de 5 palabras clave.
      </td>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📝 Tarea:</b> Responde grupalmente señalando las imágenes.<br>
        <b>👥 Interacción:</b> Plenaria.<br>
        <b>💡 Ejemplo:</b> <i>"It is an apple! It is healthy."</i>
      </td>
    </tr>
  </table>

  <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 20px 0 10px 0;"></div>
  <div style="background-color:#1a5276; color:white; padding:10px 15px; font-size:14px; font-weight:bold; border-radius:4px;">
       🎯 ETAPA 2: PRESENTATION | Tiempo: 15 min
  </div>
  <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border: 1px solid #aab7b8; font-size:11px;">
    <tr style="background-color:#d6eaf8; font-weight:bold;">
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👨‍🏫 ROL DEL MAESTRO</td>
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👩‍🎓 ROL DEL ESTUDIANTE</td>
    </tr>
    <tr>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📋 Preparación:</b> Diálogo impreso sobre "${cleanScenario}".<br>
        <b>🗣️ Guión:</b> <i>"Listen and read. We are going to see what they want to buy."</i><br>
        <b>🎬 Acción:</b> Lee el diálogo con entonación natural, modelando la estructura gramatical clave.
      </td>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📝 Tarea:</b> Subraya las palabras del vocabulario en la hoja.<br>
        <b>👥 Interacción:</b> Individual y pares.<br>
        <b>💡 Ejemplo:</b> <i>"Underlining 'grocery store' and 'vegetables'."</i>
      </td>
    </tr>
  </table>

  <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 20px 0 10px 0;"></div>
  <div style="background-color:#1a5276; color:white; padding:10px 15px; font-size:14px; font-weight:bold; border-radius:4px;">
       🎯 ETAPA 3: PREPARATION / PRACTICE | Tiempo: 15 min
  </div>
  <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border: 1px solid #aab7b8; font-size:11px;">
    <tr style="background-color:#d6eaf8; font-weight:bold;">
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👨‍🏫 ROL DEL MAESTRO</td>
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👩‍🎓 ROL DEL ESTUDIANTE</td>
    </tr>
    <tr>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📋 Preparación:</b> Ficha de completar oraciones.<br>
        <b>🗣️ Guión:</b> <i>"Complete the gaps with your partner using the vocabulary from the board."</i><br>
        <b>🎬 Acción:</b> Monitorea el aula, ofreciendo andamiaje y corrigiendo errores de forma positiva.
      </td>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📝 Tarea:</b> Resuelve los ejercicios escritos.<br>
        <b>👥 Interacción:</b> En parejas (A y B).<br>
        <b>💡 Ejemplo:</b> <i>"I would like some bananas, please."</i>
      </td>
    </tr>
  </table>

  <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 20px 0 10px 0;"></div>
  <div style="background-color:#1a5276; color:white; padding:10px 15px; font-size:14px; font-weight:bold; border-radius:4px;">
       🎯 ETAPA 4: PERFORMANCE / PRODUCTION | Tiempo: 15 min
  </div>
  <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border: 1px solid #aab7b8; font-size:11px;">
    <tr style="background-color:#d6eaf8; font-weight:bold;">
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👨‍🏫 ROL DEL MAESTRO</td>
      <td style="width:50%; padding:8px; border:1px solid #aab7b8;">👩‍🎓 ROL DEL ESTUDIANTE</td>
    </tr>
    <tr>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📋 Preparación:</b> Tarjeta de misión del juego de rol.<br>
        <b>🗣️ Guión:</b> <i>"Imagine you are in a shop. Act out the dialogue with your partner."</i><br>
        <b>🎬 Acción:</b> Designa roles y gestiona la presentación de 3 parejas al frente de la clase.
      </td>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        <b>📝 Tarea:</b> Realiza la simulación oral en público aplicando la fluidez.<br>
        <b>👥 Interacción:</b> Juego de roles.<br>
        <b>💡 Ejemplo:</b> <i>"Can I help you? - Yes, I need some carrots."</i>
      </td>
    </tr>
  </table>

  <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 20px 0 10px 0;"></div>
  <div style="background-color:#1a5276; color:white; padding:10px 15px; font-size:14px; font-weight:bold; border-radius:4px;">
       🎯 ETAPA 5: ASSESSMENT & REFLECTION | Tiempo: 15 min
  </div>
  <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border: 1px solid #aab7b8; font-size:11px;">
    <tr style="background-color:#d6eaf8; font-weight:bold;">
      <td style="padding:8px; border:1px solid #aab7b8;">📋 EVALUACIÓN FORMATIVA</td>
      <td style="padding:8px; border:1px solid #aab7b8;">🔄 REFLEXIÓN DEL ALUMNO</td>
    </tr>
    <tr>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        Uso de ticket de salida escrito (Exit Ticket): Los estudiantes escriben 2 oraciones expresando gustos o necesidades del tema aprendido en la lección.
      </td>
      <td style="padding:10px; border:1px solid #aab7b8; vertical-align:top;">
        Los estudiantes responden la escala de caras: ¿Cómo me sentí hablando inglés hoy? 😊 / 😐 / 😟
      </td>
    </tr>
  </table>
</div>
    `;
  }

  if (type === 'resources') {
    await new Promise(r => setTimeout(r, 1500));
    const cleanTheme = vars.theme || 'Healthy Eating';
    const cleanScenario = vars.scenario || 'At the local supermarket';
    const cleanGrade = vars.grade || '5th Grade';

    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px; background: #fff; border-radius: 8px;">
  <div style="background: #1a5276; color: white; padding: 12px 20px; border-radius: 6px; font-size: 16px; font-weight: bold; margin-bottom: 15px;">
    📘 RESOURCE 1 — KEY VOCABULARY: ${cleanTheme}
  </div>
  <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom: 20px;">
    <thead>
      <tr style="background-color:#1a5276; color:white;">
        <th style="padding:8px; border:1px solid #ccc;">Word / Phrase</th>
        <th style="padding:8px; border:1px solid #ccc;">Definition</th>
        <th style="padding:8px; border:1px solid #ccc;">Translation (Spanish)</th>
        <th style="padding:8px; border:1px solid #ccc;">Example Sentence</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">Healthy</td>
        <td style="padding:8px; border:1px solid #ccc;">Good for your body and health.</td>
        <td style="padding:8px; border:1px solid #ccc;">Saludable</td>
        <td style="padding:8px; border:1px solid #ccc;">Apples are a very healthy snack.</td>
      </tr>
      <tr style="background:#d6eaf8;">
        <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">Vegetables</td>
        <td style="padding:8px; border:1px solid #ccc;">Plants or parts of plants eaten as food.</td>
        <td style="padding:8px; border:1px solid #ccc;">Vegetales / Verduras</td>
        <td style="padding:8px; border:1px solid #ccc;">I buy fresh vegetables at the market.</td>
      </tr>
      <tr style="background:#ffffff;">
        <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">Shopping list</td>
        <td style="padding:8px; border:1px solid #ccc;">A list of items you want to buy.</td>
        <td style="padding:8px; border:1px solid #ccc;">Lista de compras</td>
        <td style="padding:8px; border:1px solid #ccc;">I write milk on my shopping list.</td>
      </tr>
      <tr style="background:#d6eaf8;">
        <td style="padding:8px; border:1px solid #ccc; font-weight:bold;">Customer</td>
        <td style="padding:8px; border:1px solid #ccc;">A person who buys goods in a shop.</td>
        <td style="padding:8px; border:1px solid #ccc;">Cliente</td>
        <td style="padding:8px; border:1px solid #ccc;">The customer pays for the oranges.</td>
      </tr>
    </tbody>
  </table>

  <div style="background: #1a5276; color: white; padding: 12px 20px; border-radius: 6px; font-size: 16px; font-weight: bold; margin-bottom: 15px;">
    🎧 RESOURCE 2 — LISTENING DIALOGUE SCRIPTS | Scenario: ${cleanScenario}
  </div>
  <div style="border:2px dashed #1a5276; padding:15px; border-radius:8px; font-family:'Courier New', monospace; background:#fdfefe; font-size:11px; margin-bottom:20px;">
    <b>Clerk:</b> "Good morning! Can I help you find something?"<br>
    <b>Customer:</b> "Yes, please. I am looking for fresh fruits. Where are they?"<br>
    <b>Clerk:</b> "They are in Aisle 3, right next to the bakery section."<br>
    <b>Customer:</b> "Thank you. Do you have sweet red apples?"<br>
    <b>Clerk:</b> "Yes, we do. They are $1.50 per bag today. It's a special offer."<br>
    <b>Customer:</b> "Perfect, I will take one bag. Thanks!"
  </div>

  <div style="background: #1a5276; color: white; padding: 12px 20px; border-radius: 6px; font-size: 16px; font-weight: bold; margin-bottom: 15px;">
    🎭 RESOURCE 3 — PERFORMANCE MISSION CARD
  </div>
  <div style="border:3px solid #1a5276; padding:15px; border-radius:10px; background:linear-gradient(135deg, #eaf4fb, #fdfefe); font-size:11px;">
    <p style="margin:2px 0;"><b>Scenario:</b> ${cleanScenario}</p>
    <p style="margin:2px 0;"><b>Your role:</b> You are a customer ordering food, or a clerk serving a customer.</p>
    <p style="margin:2px 0;"><b>Task:</b> Act out a shopping dialogue using at least 4 vocabulary words and the grammar structure <i>"Would you like... / I would like..."</i>.</p>
  </div>
</div>
    `;
  }

  if (type === 'theme_planner') {
    await new Promise(r => setTimeout(r, 1500));
    const grade = vars.grade || '5th Grade';
    const school = vars.school || 'Escuela Oficial República de Panamá';
    const teacher = vars.teacher || 'Prof. Carlos Alvarado';
    const region = vars.region || 'Comarca Ngäbe-Buglé';
    const trimester = vars.trimester || '1st';
    const scenarioNum = vars.scenarioNum || '1';
    const weeklyHrs = vars.weeklyHrs || 5;
    const weeks = vars.weeks || 2;
    const cefr = vars.cefr || 'A2';

    // Dynamic mapping for scenarios in Panama curriculum
    const scenarioMap = {
      '1': {
        name: 'A Walk in the Neighborhood',
        receptiveTheme: 'This Is My Favorite.',
        interactiveTheme: 'It\'s the Best!',
        vocab: 'neighborhood, park, library, store, swings, toys, house, street, place, school, shop',
        grammar: 'Superlatives (e.g., "The library is the best place to read."). Like / Dislike preferences (e.g., "I like the park because it has swings.").',
        materials: 'Print: Map of a neighborhood, reading cards. Digital: E-learning neighborhood vocabulary song. Realia: Local town pictures.'
      },
      '2': {
        name: 'Helping in the Garden',
        receptiveTheme: 'The Tomatoes Grow Quickly.',
        interactiveTheme: 'These Plants Are from Panama.',
        vocab: 'garden, plant, tomato, seed, soil, watering can, flower, vegetable, sunlight, hose, rainwater, grow, water, harvest, bloom, care, dig, need, put, add, cover, green, bright, healthy, quick, tall, every day, sometimes, always, first, second',
        grammar: 'Present simple + \'s\' (e.g., "María waters the plants every day."). Demonstratives (this, that, these, those). Question forms (e.g., "Do you like watering the plants?").',
        materials: 'Print: Step-by-Step Planting Guide worksheet. Digital: Wordwall Gardening Vocabulary game. Realia: Real flower pot, soil, tomato seeds.'
      },
      '3': {
        name: 'My Neighborhood',
        receptiveTheme: 'Community places and maps',
        interactiveTheme: 'Giving directions to visitors',
        vocab: 'supermarket, fire station, police station, park, library, hospital, bakery, corner, street, block, bridge',
        grammar: 'Imperatives for directions (turn left, turn right, go straight). Prepositions of direction (across from, next to, between).',
        materials: 'Print: Map of a small city, directions matching card. Digital: Google Maps virtual tour of a neighborhood. Realia: Toy cars, physical street map.'
      },
      '4': {
        name: 'Amazing Animals',
        receptiveTheme: 'Habitats and animal features',
        interactiveTheme: 'Describing and protecting pets',
        vocab: 'jungle, desert, ocean, feathers, fur, scales, claws, tail, wings, mammals, reptiles, endangered, protection',
        grammar: 'Can / Cannot for ability. Comparative adjectives (bigger than, faster than).',
        materials: 'Print: Animal cards, reading "Wild Habitats". Digital: National Geographic Kids video. Realia: Stuffed animal toys.'
      },
      '5': {
        name: 'Let\'s Travel',
        receptiveTheme: 'Weather and packing lists',
        interactiveTheme: 'Booking tickets and travel plans',
        vocab: 'sunny, rainy, windy, cold, hot, luggage, ticket, passport, hotel, beach, mountain, travel agent, suitcase',
        grammar: 'Going to for future plans. Present continuous for future arrangements.',
        materials: 'Print: Weather chart, passport mockup template. Digital: Duolingo travel expressions, weather forecasting app. Realia: Suitcase, boarding pass mockup.'
      },
      '6': {
        name: 'At the Market',
        receptiveTheme: 'Fruits and vegetable items',
        interactiveTheme: 'Buying and selling ingredients',
        vocab: 'oranges, bananas, carrots, tomatoes, onions, customer, seller, price, dollar, change, shopping bag, scales',
        grammar: 'How much / How many. Numbers up to 100. Polite requests (Can I have... please?).',
        materials: 'Print: Price tags list, shopping list worksheet. Digital: Interactive market roleplay video. Realia: Plastic play money, real fruits.'
      },
      '7': {
        name: 'Tech World',
        receptiveTheme: 'Devices and screen rules',
        interactiveTheme: 'How to use an app',
        vocab: 'computer, smartphone, tablet, screen, keyboard, mouse, internet, password, download, upload, social media',
        grammar: 'Should / Should not for advice and rules. Sequence adverbs (first, then, next, finally).',
        materials: 'Print: Digital etiquette rule sheet, app flowchart template. Digital: Online typing tutor game, digital safety presentation. Realia: Keyboard, old mobile phone.'
      },
      '8': {
        name: 'Caring for Planet Earth',
        receptiveTheme: 'Recycling and natural resources',
        interactiveTheme: 'Creating an eco-friendly poster',
        vocab: 'recycle, reduce, reuse, environment, garbage, plastic, paper, glass, planet, trees, energy, water saving',
        grammar: 'Must / Must not for obligations. First conditional (If we recycle, we will save the planet).',
        materials: 'Print: Recycling sorting cards, Earth Day reading passage. Digital: Interactive quiz on Kahoot about ecology. Realia: Recyclable waste bins, scrap paper.'
      },
      '9': {
        name: 'Expressing Ourselves',
        receptiveTheme: 'Feelings and body language',
        interactiveTheme: 'Roleplaying emotional situations',
        vocab: 'happy, sad, angry, surprised, scared, tired, gesture, posture, smile, frown, advice, empathy, body language',
        grammar: 'Why / Because. Linking words (and, but, so). Feeling verbs (feel, seem, look).',
        materials: 'Print: Emotion faces chart, reading "How Do You Feel?". Digital: Animated short film about feelings. Realia: Hand mirrors, emotion flashcards.'
      },
      '10': {
        name: 'Traditions and Culture',
        receptiveTheme: 'Panamanian festivals and history',
        interactiveTheme: 'Inviting someone to a folklore dance',
        vocab: 'folklore, pollera, montuno, drum, parade, festival, heritage, history, invitation, guest, dance, music, typical food',
        grammar: 'Simple past tense (regular and irregular verbs). Polite invitations (Would you like to join us?).',
        materials: 'Print: Cultural reading sheet, invitation card template. Digital: Video of "El Tamborito" traditional dance. Realia: Mini tipico drum, typical crafts.'
      }
    };

    const selectedScenario = scenarioMap[scenarioNum] || {
      name: vars.scenario || `Custom Scenario ${scenarioNum}`,
      receptiveTheme: vars.theme || 'Receptive skills development',
      interactiveTheme: vars.theme || 'Interactive communication skills',
      vocab: 'vocabulary, words, phrases, terms, definitions, context, expressions, forms',
      grammar: 'Grammatical structures relevant to the selected topic level.',
      materials: 'Print: Reading worksheets. Digital: Online tasks. Realia: Target objects.'
    };

    const currentScenarioName = `Scenario ${scenarioNum}: ${selectedScenario.name}`;
    const currentTheme = (vars.theme && vars.theme !== `Theme from Scenario ${scenarioNum}`) ? vars.theme : (vars.themeType === 'receptive' ? selectedScenario.receptiveTheme : selectedScenario.interactiveTheme);
    const focusType = vars.themeType === 'receptive' ? 'Receptive / Receptivo (Listening/Reading focus)' : 'Interactive / Interactivo (Speaking/Writing focus)';

    const fileNotice = media ? `
  <div style="background: #e8f8f5; border: 1px solid #a3e4d7; color: #117a65; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 11px; text-align: left;">
    <strong>📂 Modo Demo - Archivo "${media.name}" cargado con éxito:</strong><br>
    Se ha leído la información curricular de este PDF. La IA ha extraído el tema y escenario del documento, y ha rellenado automáticamente los Objetivos Específicos y Metas SMART.
  </div>` : `
  <div style="background: #eaf2f8; border: 1px solid #aed6f1; color: #2e4053; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 11px; text-align: left;">
    <strong>📂 Modo Demo - Currículo pre-cargado seleccionado:</strong><br>
    Simulación para "${grade}" en el Escenario ${scenarioNum} (${selectedScenario.name}), con enfoque ${vars.themeType === 'receptive' ? 'Receptivo (Tema 1)' : 'Interactivo (Tema 2)'}.
  </div>`;

    const section4Html = `
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px; width: 120px;">Listening</td>
        <td style="border: 1px solid #333; padding: 6px;">By the end of the unit, ${grade} students will identify key vocabulary and details in simple oral passages about ${currentTheme} as evidenced by a comprehension matching task.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Reading</td>
        <td style="border: 1px solid #333; padding: 6px;">By the end of the unit, ${grade} students will extract core ideas and read short illustrated texts about ${currentTheme} as evidenced by completing a graphic organizer.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Speaking</td>
        <td style="border: 1px solid #333; padding: 6px;">By the end of the unit, ${grade} students will ask and answer simple questions and roleplay a dialogue in "${selectedScenario.name}" as evidenced by a rubric assessment.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Writing</td>
        <td style="border: 1px solid #333; padding: 6px;">By the end of the unit, ${grade} students will write 3-5 simple sentences using target grammar about ${currentTheme} in "${selectedScenario.name}" as evidenced by a writing checklist.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Mediation</td>
        <td style="border: 1px solid #333; padding: 6px;">By the end of the unit, ${grade} students will translate and simplify simple signs or notices related to ${currentTheme} as evidenced by a mediation task.</td>
      </tr>
    `;

    const section6Html = `
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px; width: 120px;">Lesson 1 (Listening)</td>
        <td style="border: 1px solid #333; padding: 6px;"><b>Listening Focus:</b> The teacher hooks students using a colorful poster showing ${currentTheme} in the context of "${selectedScenario.name}". The teacher models vocabulary pronunciation and check understanding using Concept Checking Questions (CCQs). Students complete a visual vocabulary matching worksheet.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Lesson 2 (Reading)</td>
        <td style="border: 1px solid #333; padding: 6px;"><b>Reading Focus:</b> Students read a short text describing ${currentTheme} routines in Panama. They answer factual reading questions and locate vocabulary items in context to build their decoding and comprehension skills.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Lesson 3 (Speaking)</td>
        <td style="border: 1px solid #333; padding: 6px;"><b>Speaking Focus:</b> Students practice oral repetition and run a semi-controlled pair interview about their ${currentTheme} preferences. They practice asking and answering questions inside the scenario: "${selectedScenario.name}".</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Lesson 4 (Writing)</td>
        <td style="border: 1px solid #333; padding: 6px;"><b>Writing Focus:</b> In teams, students write their own short dialogue scripts or grocery/packing lists set in "${selectedScenario.name}". They exchange papers with other groups for peer correction and feedback.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px; width: 120px;">Lesson 5 (Mediation)</td>
        <td style="border: 1px solid #333; padding: 6px;"><b>Mediation & Project Focus:</b> Students work in teams to finalize their 21st-Century Skills Project (e.g., creating a poster, presentation, or map). They engage in mediation activities by translating, explaining, or adapting their group project content to present it to other teams. The teacher facilitates peer review and provides a self-reflection checklist on collaboration and communicative competence.</td>
      </tr>
    `;

    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.5; padding: 20px; background: #fff; border-radius: 8px;">
  ${fileNotice}
  <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #1a3a5c; padding-bottom: 10px;">
    <h2 style="font-size: 14px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">MINISTRY OF EDUCATION</h2>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">REGIONAL EDUCATION DIRECTORATE OF ${region.toUpperCase()}</h3>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0;">SCHOOL: ${school}</h3>
    <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">Theme Planner # ${vars.plannerNum || '1'}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <tr>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px; width: 120px;">1. Teacher(s):</td>
      <td colspan="5" style="border: 1px solid #333; padding: 6px;">${teacher}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px;">2. Grade:</td>
      <td style="border: 1px solid #333; padding: 6px;">${grade}</td>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px; width: 100px;">3. CEFR Level:</td>
      <td style="border: 1px solid #333; padding: 6px;">${cefr}</td>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px; width: 100px;">4. Trimester:</td>
      <td style="border: 1px solid #333; padding: 6px;">${trimester} Trimester</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px;">5. Weekly Hour(s):</td>
      <td style="border: 1px solid #333; padding: 6px;">${weeklyHrs} hours</td>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px;">6. Week(s):</td>
      <td colspan="3" style="border: 1px solid #333; padding: 6px;">${weeks} weeks</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px;">7. Scenario:</td>
      <td colspan="2" style="border: 1px solid #333; padding: 6px;">${currentScenarioName}</td>
      <td style="font-weight: bold; background: #d6eaf8; border: 1px solid #333; padding: 6px;">8. Theme:</td>
      <td colspan="2" style="border: 1px solid #333; padding: 6px;">${currentTheme}</td>
    </tr>
  </table>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-top: 15px;">
    2. SPECIFIC STANDARDS AND LEARNING OUTCOMES
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #f0f7ff; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 100px;">Skills</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Specific Standards</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Learning Outcomes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Listening</td>
        <td style="border: 1px solid #333; padding: 6px;">Identifies key details and terms in simple oral texts related to the topic.</td>
        <td style="border: 1px solid #333; padding: 6px;">Students will be able to extract core vocabulary in oral interactions about ${currentTheme}.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Reading</td>
        <td style="border: 1px solid #333; padding: 6px;">Reads and decodes short illustrated paragraphs and sentences about the unit.</td>
        <td style="border: 1px solid #333; padding: 6px;">Students will be able to match written phrases with corresponding visual triggers.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Speaking</td>
        <td style="border: 1px solid #333; padding: 6px;">Asks and answers basic questions to complete cooperative tasks in typical scenarios.</td>
        <td style="border: 1px solid #333; padding: 6px;">Students will be able to perform a guided short dialogue with a peer.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Writing</td>
        <td style="border: 1px solid #333; padding: 6px;">Composes short guided sentences using frames and vocabulary lists.</td>
        <td style="border: 1px solid #333; padding: 6px;">Students will be able to write down a grocery list or short message.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; border: 1px solid #333; padding: 6px;">Mediation</td>
        <td style="border: 1px solid #333; padding: 6px;">Simplifies or translates simple signs, instructions, or notices to facilitate communication.</td>
        <td style="border: 1px solid #333; padding: 6px;">Students will be able to explain a simple sign or notice about ${currentTheme} to a classmate.</td>
      </tr>
    </tbody>
  </table>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-top: 15px;">
    3. COMMUNICATIVE COMPETENCES
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #f0f7ff; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 33%;">Linguistic (Learn to Know)</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 33%;">Pragmatic (Learn to Do)</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 33%;">Sociolinguistic (Learn to Be)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #333; padding: 6px;">
          ● <b>Grammar:</b> ${selectedScenario.grammar}<br>
          ● <b>Vocab:</b> ${selectedScenario.vocab}<br>
          ● <b>Pronunciation:</b> Clear articulation of phonemic contrasts in key words.
        </td>
        <td style="border: 1px solid #333; padding: 6px;">
          ● Initiating simple communications in the scenario "${selectedScenario.name}".<br>
          ● Requesting information using basic question structures.<br>
          ● Exchanging likes, dislikes, or descriptions.
        </td>
        <td style="border: 1px solid #333; padding: 6px;">
          ● Show cooperation and politeness inside school interactions.<br>
          ● Apply proper greeting forms matching Panama context.<br>
          ● Values recycling, health or community helpers.
        </td>
      </tr>
    </tbody>
  </table>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-top: 15px;">
    4. SPECIFIC OBJECTIVES (SMART GOALS)
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #f0f7ff; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 120px;">Lesson Sequence</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">SMART Objective</th>
      </tr>
    </thead>
    <tbody>
      ${section4Html}
    </tbody>
  </table>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-top: 15px;">
    5. MATERIALS AND TEACHING STRATEGIES
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #f0f7ff; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 50%;">Materials (Extracted from Curriculum)</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 50%;">Differentiated Accommodations (DLN)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #333; padding: 6px;">
          ${selectedScenario.materials}
        </td>
        <td style="border: 1px solid #333; padding: 6px;">
          🔴 <b>Learning Difficulties:</b> Provide extra visual aids, reduce task length, and use bilingual matching worksheets.<br>
          🟡 <b>On-Grade Level:</b> standard peer-practice routines.<br>
          🟢 <b>Advanced:</b> ask students to act as team facilitators and write extended dialogs.
        </td>
      </tr>
    </tbody>
  </table>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-top: 15px;">
    6. LEARNING SEQUENCE (LESSONS 1 TO 5)
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
    <thead>
      <tr style="background: #f0f7ff; font-weight: bold;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 120px;">Lesson Sequence</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Detailed Activities & Stages</th>
      </tr>
    </thead>
    <tbody>
      ${section6Html}
    </tbody>
  </table>
</div>
    `;
  }

  return '';
}


// ── Secure API Content generator ──
export async function generateCurriculumContent(type, vars, media = null) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.log(`Gemini API Key missing. Generating simulated response for ${type}...`);
    return await simulateResponse(type, vars, media);
  }

  const { systemPrompt, userMsg } = getPromptTemplate(type, vars);

  try {
    const parts = [{ text: userMsg }];
    if (media && media.base64Data && media.mimeType) {
      parts.push({
        inlineData: {
          mimeType: media.mimeType,
          data: media.base64Data
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Cleanup markdown code blocks if the AI surrounded the HTML/JSON with it
    text = text.replace(/```json|```html|```/g, '').trim();

    return text;
  } catch (error) {
    console.error("Gemini API error, falling back to simulated data:", error);
    return await simulateResponse(type, vars, media);
  }
}

// ── Multimodal Screenshot/File Extractor (Gemini) ──
export async function extractCurriculumFromMedia(base64Data, mimeType) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.log("Gemini API Key missing. Simulating multimodal extraction...");
    // Simulate latency
    await new Promise(r => setTimeout(r, 2000));

    // Return a smart set of simulated inputs based on a standard timetable
    return {
      theme: "Community Services & Neighborhoods",
      scenario: "Interviewing a local firefighter or officer",
      grade: "6th Grade",
      weeks: 3,
      weeklyHours: 5
    };
  }

  const promptText = `Analyze this curriculum document or timetable image. Extract the following details as a clean JSON object (no markdown, no extra text):
{
  "theme": "Extracted Theme (in English, e.g., Healthy Habits)",
  "scenario": "Extracted Scenario (in English, e.g., At the Market)",
  "grade": "Extracted Grade Level (in English, e.g., 5th Grade)",
  "weeks": 2,
  "weeklyHours": 5
}
If any field is missing or cannot be found, make a logical guess based on the context of the image. Ensure the grade is parsed to templates like '1st Grade', '6th Grade', '12th Grade' or similar.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    text = text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error during multimodal media extraction:", error);
    return {
      theme: "Community Services & Neighborhoods",
      scenario: "Interviewing a local firefighter or officer",
      grade: "6th Grade",
      weeks: 3,
      weeklyHours: 5
    };
  }
}

// ── Custom Prompt Compiler (Matches User Prompt Files) ──
function getPromptTemplate(type, vars) {
  const skillsStr = vars.skills?.join(', ') || 'Listening, Reading';
  const lessonNum = vars.lessonNum || 1;
  const grade = vars.grade || '5th Grade';
  const scenery = vars.scenario || 'Planning a party';
  const theme = vars.theme || 'Food and Drinks';

  if (type === 'planner' || type === 'lessonplanner') {
    return {
      systemPrompt: `You are an expert curriculum designer certified by MEDUCA (Ministerio de Educación de Panamá). CRITICAL: Llenar todo el formato en inglés (All generated content, fields, and activities must be written in English).
    Generate a complete, professional LESSON PLANNER strictly following the Action-Oriented Approach (AOA) 
    framework used in Panama's National English Curriculum.

    ════════════════════════════════════════
    CONTEXT VARIABLES (USE THESE THROUGHOUT):
    ════════════════════════════════════════
    - Lesson Number   : ${lessonNum}
    - Skills Focus    : ${skillsStr}
    - Grade Level     : ${grade}
    - Scenario        : ${scenery}
    - Theme           : ${theme}
    - Lesson within Theme: This is Lesson ${lessonNum} of 5 in the theme sequence.

    ════════════════════════════════════════
    OUTPUT STRUCTURE — FOLLOW THIS EXACTLY:
    ════════════════════════════════════════

    ## SECTION 1 — HEADER BANNER
    Render a styled HTML banner with:
    Title: "Lesson Planner – Theme # ___ – Lesson # ${lessonNum}"
    Subtitle instruction: "Complete this planner five times per theme, once per lesson (Lesson 1 through Lesson 5)."

    ## SECTION 2 — LESSON IDENTIFICATION TABLE
    A dashed-border HTML table with these fields in a grid layout:
    Row 1: [Lesson #: ${lessonNum}] [Skills Focus: ${skillsStr}]
    Row 2: [Grade: ${grade}] [Scenario: ${scenery}] [Theme: ${theme}]
    Row 3: [Date(s): From ___ to ___] [Learning Sequence Time: ___]
    Row 4 (full width): 
      - Specific Objective: (Write ONE clear, measurable objective aligned to ${skillsStr} skills. 
        Use action verbs from Bloom's Taxonomy: identify, compare, produce, demonstrate, evaluate, etc.)
      - Learning Outcome: (Write 2–3 bullet points. Start each with "Students will be able to..." 
        aligned to MEDUCA's competency framework for grade ${grade}.)

    ## SECTION 3 — AOA STAGES TABLE
    Title: "The Six Action-Oriented Approach (AOA) Lesson Stages"
    A 3-column HTML table with dashed borders:
    Columns: [Stage & Description] [Activities & Teacher Actions] [Estimated Date and Time]

    Include ALL 6 stages with detailed content in English:

    STAGE 1 — Warm-up / Pre-task (Engagement, Modeling and Clarification)

      • Warm-up: (Describe a brief warm-up activity that connects to the theme "${theme}" and activates students' prior knowledge. Include suggested materials such as visuals, audio, or realia if applicable.)
      • Modeling: (Explain how the teacher will present the target language or skills for this lesson. Describe the teacher's role in demonstrating the language and clarifying meaning.)
      • Clarification: (Detail how the teacher will check for understanding of the new language or skills, using concept-checking questions (CCQs) and examples.)

    STAGE 2 — Presentation
      • Input of new language/content connected to Scenario: "${scenery}".
      • Text, dialogue, or audio/visual input suggestion.
      • Comprehension tasks (True/False, matching, gist questions).

      • Material: (Describe the text/dialogue: genre, style, register, and format — e.g., "dialogue for an interview", "short notice", "instructions", "narrative excerpt").
      • Communicative Competence: (State the specific communicative competence from MEDUCA for this lesson, e.g., "Communicative Competence: Interaction and Spoken Communication: Expressing preferences and opinions", "Communicative Competence: Reading for Information: Understanding main ideas in short texts").

    STAGE 3 — Preparation / Practice

      • Focus on accuracy of ${skillsStr}.
      • Detalla las actividades
      • Communicative Skill: (e.g., "Interaction and Spoken Communication: Participating in short conversations").
      • Language Content: (e.g., "Key expressions for asking and answering personal questions").
      • Procedure: (Describe at least three specific classroom activities for this stage, e.g., "1. Fill-in-the-blank exercises with the target vocabulary. 2. Sentence-building using the new grammatical structures. 3. Short controlled dialogues in pairs focusing on pronunciation and intonation.").

    STAGE 4 — Performance / Production
      • Communicative task where students USE the language in a realistic scenario.
      • Describe the task format (role-play, presentation, written product, debate, etc.)
      • Connect to Scenario: "${scenery}" and Theme: "${theme}".
      • Focus on fluency and communication.

    STAGE 5 — Assessment / Post-task
      • Formative assessment strategy (observation checklist, exit ticket, peer assessment, 
        self-assessment rubric, or digital quiz suggestion).
      • How teacher collects evidence of learning aligned to the Specific Objective.

      • Assessment Task: (Describe the specific task students will perform, e.g., "Role-play: Presenting a favorite book to a partner.", "Written Report: Describing a community helper.", "Group Debate: Sharing opinions on healthy eating.").
      • Evaluation Criteria: (Specify how the performance will be assessed, e.g., Use of target vocabulary, grammatical accuracy, clarity of communication, collaboration in group tasks). 

    STAGE 6 — Reflection
      • Student self-reflection prompt (2–3 guiding questions for learners).
      • Teacher reflection: What worked? What to adjust for next lesson?
      • Connection to next lesson in the theme sequence.

    ## SECTION 4 — COMMENTS AND OBSERVATIONS FOOTER
    A dashed-border box divided into 3 sub-sections:
      📝 Homework: (Assign meaningful, skill-reinforcing homework related to ${theme}.)
      📊 Formative Assessment of Learning: (Describe the evidence collected this lesson.)
      💬 Teacher's Comments / Observations: (Open space for teacher notes.)

    ════════════════════════════════════════
    QUALITY STANDARDS:
    ════════════════════════════════════════
    - Language: Professional English throughout.
    - Alignment: Every activity must connect to Skills Focus (${skillsStr}), Scenario (${scenery}), and Theme (${theme}).
    - Bloom's Taxonomy: Progression from lower-order (remember, understand) to higher-order (apply, create) thinking.
    - Differentiation: Include at least ONE suggestion per stage for supporting struggling learners (scaffolding) 
      and challenging advanced learners (extension task).
    - Time awareness: Suggest realistic time allocations per stage (total ~45–60 min for a standard MEDUCA class).
    - Use HTML tables with style="border: 1px dashed #333; border-collapse: collapse; width: 100%; margin: 10px 0;"
    - Use color #1a5276 for all headings and stage titles.
    - Tone: Practical, encouraging, and teacher-friendly.`,
      userMsg: `Generate the complete official AOA Lesson Planner. Theme: "${theme}", Grade: "${grade}", Scenario: "${scenery}", Objective: "${vars.objective}", Outcome: "${vars.outcome}".`
    };
  }

  if (type === 'delivery') {
    return {
      systemPrompt: `Actúa como un MENTOR PEDAGÓGICO EXPERTO del sistema educativo de Panamá (MEDUCA), 
    especializado en el Enfoque Orientado a la Acción (AOA) para la enseñanza del inglés.

    Tu misión es generar una GUÍA DE ENTREGA DE CLASE (LESSON DELIVERY GUIDE) completa, 
    detallada y lista para usar, que acompañe directamente al Lesson Planner oficial.

    ════════════════════════════════════════
    VARIABLES DE CONTEXTO:
    ════════════════════════════════════════
    - Lección N°      : ${lessonNum}
    - Habilidades     : ${skillsStr}
    - Grado           : ${grade}
    - Escenario       : ${scenery}
    - Tema            : ${theme}

    ════════════════════════════════════════
    PROPÓSITO DE ESTE DOCUMENTO:
    ════════════════════════════════════════
    Explicarle al docente EXACTAMENTE cómo ejecutar cada etapa del Lesson Planner, 
    con guiones sugeridos, estrategias de mediación pedagógica, gestión del aula 
    y ejemplos de lenguaje de maestro/estudiante.

    ════════════════════════════════════════
    ESTRUCTURA OBLIGATORIA POR ETAPA AOA:
    ════════════════════════════════════════
    Para CADA UNA de las 6 etapas, usa ESTE CÓDIGO HTML exactamente:

    <div class="stage-divider" style="border-top: 3px solid #1a5276; margin: 25px 0 10px 0;"></div>
    <div class="stage-title" style="background-color:#1a5276; color:white; padding:10px 15px; 
         font-size:16px; font-weight:bold; border-radius:4px;">
         🎯 ETAPA [N°]: [NOMBRE DE LA ETAPA] 
         <span style="font-size:12px; font-weight:normal;">| Tiempo estimado: ___ min</span>
    </div>

    <table class="aoa-table" style="width:100%; border-collapse:collapse; margin-bottom:15px; 
           border: 1px solid #aab7b8e7;">
      <thead>
        <tr style="background-color:#d6eaf8;">
          <th style="width:50%; padding:10px; border:1px solid #aab7b8; text-align:left;">
            👨‍🏫 ROL DEL MAESTRO — Guía, Diálogos y Gestión
          </th>
          <th style="width:50%; padding:10px; border:1px solid #aab7b8; text-align:left;">
            👩‍🎓 ROL DEL ESTUDIANTE — Acciones y Producción
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:12px; border:1px solid #aab7b8; vertical-align:top;">
            <b>📋 Preparación:</b> [Qué debe tener listo el docente — materiales, pizarra, proyector, etc.]<br><br>
            <b>🗣️ Instrucciones para los estudiantes:</b><br>
            <i>"[Guión sugerido en inglés — lenguaje claro y simple apropiado para Grado ${grade}]"</i><br><br>
            <b>🎬 Descripción de la actividad:</b> [Paso a paso de lo que hace el maestro]<br><br>
            <b>🤝 Mediación pedagógica:</b> [Cómo apoyar, preguntar, verificar comprensión — CCQs]<br><br>
            <b>⚡ Si hay dificultades:</b> [Estrategia de andamiaje / scaffolding para estudiantes con dificultades]<br><br>
            <b>🚀 Extensión:</b> [Cómo desafiar a los estudiantes avanzados]
          </td>
          <td style="padding:12px; border:1px solid #aab7b8; vertical-align:top;">
            <b>📝 Tarea del estudiante:</b> [Qué debe estar haciendo el alumno, específicamente]<br><br>
            <b>👥 Modo de interacción:</b> [Individual / Pares / Grupos pequeños / Plenaria]<br><br>
            <b>🗣️ Producción esperada:</b> [Qué dicen, escriben o hacen — ejemplo de respuesta modelo]<br><br>
            <b>✅ Indicador de logro:</b> [Cómo el maestro sabe que el estudiante lo logró]<br><br>
            <b>💡 Ejemplo de respuesta del estudiante:</b><br>
            <i>"[Ejemplo real de lo que un estudiante diría/escribiría en esta etapa]"</i>
          </td>
        </tr>
      </tbody>
    </table>

    ════════════════════════════════════════
    CONTENIDO DETALLADO PARA CADA ETAPA:
    ════════════════════════════════════════

    ETAPA 1 — Warm-up / Pre-task (Engagement, Modeling, Clarification)
    - Actividad de enganche relacionada a "${theme}" y "${scenery}".
    - Guión completo de cómo presentar el topic del día.
    - Técnica de modeling del lenguaje enfocada en ${skillsStr}.
    - 3 ejemplos de CCQs (Concept Checking Questions) con respuestas esperadas.
    - Cómo transicionar a la siguiente etapa.

    ETAPA 2 — Presentation
    - Descripción del input (texto, audio, video, diálogo) con guión de presentación.
    - Cómo guiar la comprensión paso a paso.
    - Técnicas de questioning (preguntas de display y referencial).
    - Manejo del vocabulario nuevo relacionado al tema "${theme}".

    ETAPA 3 — Preparation / Practice
    - Actividad controlada con instrucciones detalladas.
    - Actividad semi-controlada en pares/grupos con guión de monitoreo.
    - Cómo circular por el aula y dar feedback correctivo de forma positiva.
    - Frases modelo del maestro para dar retroalimentación.

    ETAPA 4 — Performance / Production
    - Descripción completa de la tarea comunicativa ambientada en "${scenery}".
    - Cómo organizar el aula para la actividad (distribución, tiempo, roles).
    - Rúbrica o lista de criterios de evaluación de la producción.
    - Cómo cerrar la actividad y hacer plenaria/socialización.

    ETAPA 5 — Assessment / Post-task
    - Instrumento de evaluación formativa sugerido (con ejemplo concreto).
    - Cómo registrar la evidencia de aprendizaje.
    - Estrategia de autoevaluación del estudiante (con escala o checklist).
    - Preguntas de reflexión para el grupo.

    ETAPA 6 — Reflection
    - 3 preguntas de reflexión para los estudiantes sobre su propio aprendizaje.
    - Espacio de reflexión del docente: ¿Qué funcionó? ¿Qué ajustar?
    - Conexión explícita con la siguiente lección del tema.

    ════════════════════════════════════════
    SECCIÓN FINAL OBLIGATORIA:
    ════════════════════════════════════════

    ## 📚 RECURSOS Y MATERIALES SUGERIDOS
    Proporciona una sección con:
    - 3–5 sitios web gratuitos relacionados a "${theme}" y "${scenery}" (con URL y descripción breve. ejemplo https://educapanama.edu.pa/?q=programa-rediseno-curricular-2026).
    - Sugerencia de material auténtico (video, canción, artículo corto).
    - Apps o herramientas digitales recomendadas para esta lección (Quizlet, Padlet, Jamboard, etc.).

    ## 📝 TAREA / HOMEWORK DETALLADO
    - Descripción clara de la tarea para casa.
    - Instrucciones que el maestro puede copiar y pegar o escribir en la pizarra.
    - Criterios de revisión de la tarea.

    ## 🔄 DIFERENCIACIÓN PEDAGÓGICA
    Tabla con 3 columnas: [Estudiantes con dificultades] [Estudiantes promedio] [Estudiantes avanzados]
    Indicar cómo adaptar la lección para cada perfil.

    ════════════════════════════════════════
    ESTÁNDARES DE CALIDAD:
    ════════════════════════════════════════
    - Idioma principal: ESPAÑOL, con ejemplos de lenguaje del aula en INGLÉS (entre comillas itálicas).
    - Todo el contenido debe estar alineado a: Habilidades (${skillsStr}), Escenario (${scenery}), Tema (${theme}).
    - Tono: Práctico, motivador, coloquial-profesional. Hablarle al docente directamente (tú/usted).
    - Evita el lenguaje académico excesivo. El maestro debe poder leer esto en clase y seguirlo.
    - Cada guión de diálogo debe ser realista y apropiado para estudiantes de Grado ${grade}.
    - Progresión de Bloom: Etapas 1–2 (Recordar/Comprender) → Etapas 3–4 (Aplicar/Analizar) → Etapas 5–6 (Evaluar/Crear).`,
      userMsg: `Genera la guía detallada de Lesson Delivery (ESP). Tema: "${theme}", Grado: "${grade}", Escenario: "${scenery}", Habilidades: "${skillsStr}".`
    };
  }

  if (type === 'resources') {
    return {
      systemPrompt: `You are an expert EFL materials designer for MEDUCA Panama's Action-Oriented Approach (AOA).
    Generate a COMPLETE RESOURCE PACK — fully ready to print and use in class.
    
    ════════════════════════════════════════
    CONTEXT VARIABLES:
    ════════════════════════════════════════
    - Theme        : ${theme}
    - Scenario     : ${scenery}
    - Skills Focus : ${skillsStr}
    - Grade        : ${grade}
    - Lesson #     : ${lessonNum}

    ════════════════════════════════════════
    CRITICAL RULES:
    ════════════════════════════════════════
    ⚠️ DO NOT describe or summarize resources. PRODUCE THEM IN FULL.
    ⚠️ Every text, dialogue, activity, and task must be 100% usable as printed material.
    ⚠️ Language level must match Grade ${grade} students in Panama.
    ⚠️ All content must connect to Theme: "${theme}" and Scenario: "${scenery}".
    ⚠️ Format everything as styled HTML tables and activity cards.

    ════════════════════════════════════════
    DELIVER EXACTLY THESE 7 RESOURCES:
    ════════════════════════════════════════

    ─────────────────────────────────────────
    📘 RESOURCE 1 — VOCABULARY CHART (Stage 1 & 2 Support)
    ─────────────────────────────────────────
    Title: "Key Vocabulary – ${theme}"
    
    Deliver a fully populated HTML table with 12–15 words/phrases:
    
    <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif;">
      <thead>
        <tr style="background-color:#1a5276; color:white;">
          <th style="padding:10px; border:1px solid #ccc;">#</th>
          <th style="padding:10px; border:1px solid #ccc;">Word / Phrase</th>
          <th style="padding:10px; border:1px solid #ccc;">Part of Speech</th>
          <th style="padding:10px; border:1px solid #ccc;">Definition (Simple English)</th>
          <th style="padding:10px; border:1px solid #ccc;">Example Sentence (${theme} context)</th>
          <th style="padding:10px; border:1px solid #ccc;">Translation (Spanish)</th>
          <th style="padding:10px; border:1px solid #ccc;">Image Clue (describe a visual)</th>
        </tr>
      </thead>
      <tbody>
        [Fill ALL 12–15 rows with real vocabulary from the theme "${theme}" — 
         include nouns, verbs, adjectives, and useful phrases. 
         Use alternating row colors: white and #d6eaf8]
      </tbody>
    </table>

    Below the table, add a VOCABULARY ACTIVITY:
    "✏️ Activity: Match It! — Draw a line from the word to its correct definition."
    Present 8 words in a two-column matching HTML table (words on left, 
    shuffled definitions on right — ready to print).

    ─────────────────────────────────────────
    🎧 RESOURCE 2 — LISTENING SCRIPT / AUDIO DIALOGUE (Stage 2: Presentation)
    ─────────────────────────────────────────
    Title: "Listening Script – ${theme} | Scenario: ${scenery}"
    
    Write a COMPLETE, REALISTIC dialogue of 12–16 exchanges between 
    2–3 characters in the context of "${scenery}" and topic "${theme}".
    
    Format as a script card:
    <div style="border:2px dashed #1a5276; padding:20px; border-radius:8px; 
                font-family:'Courier New', monospace; background:#fdfefe;">
      <h3 style="color:#1a5276;">🎧 Listening Script: [Title related to ${theme}]</h3>
      <p style="font-size:12px; color:#666;">
        Characters: [Name 1] – [Role], [Name 2] – [Role] | Setting: ${scenery}
      </p>
      <hr/>
      [FULL SCRIPT — 12 to 16 turns of natural conversation]
      Each line formatted as: <b>[CHARACTER NAME]:</b> "[dialogue line]"
    </div>

    After the script, add COMPREHENSION TASKS in a table:
    
    Task A — While Listening: 
    HTML table with 5 True/False statements about the dialogue 
    (columns: Statement | True | False)
    
    Task B — After Listening: 
    HTML table with 4 open-ended comprehension questions 
    (columns: Question | My Answer)
    
    Task C — Vocabulary in Context: 
    HTML table with 5 underlined words from the script, 
    asking students to guess meaning from context 
    (columns: Word from Script | What I think it means | Dictionary meaning)

    ─────────────────────────────────────────
    📖 RESOURCE 3 — READING TEXT + ACTIVITIES (Stage 2 & 3: Presentation & Practice)
    ─────────────────────────────────────────
    Title: "Reading: [Engaging Title Related to ${theme}]"
    
    Write a COMPLETE, ORIGINAL reading text of 180–220 words appropriate for Grade ${grade}.
    The text must:
    - Be written in natural English, not simplified to the point of being unnatural
    - Be set in the context of "${scenery}" and about the topic "${theme}"
    - Include 8–10 of the vocabulary words from Resource 1
    - Be organized in 3–4 short paragraphs with a title and subheadings
    
    Format as a reading card:
    <div style="border:2px solid #1a5276; padding:20px; border-radius:8px; 
                font-family:Georgia, serif; line-height:1.8; background:#fdfefe;">
      <h2 style="color:#1a5276; text-align:center;">[TITLE]</h2>
      <p style="font-size:11px; color:#888; text-align:center;">
        📚 Reading | Theme: ${theme} | Grade: ${grade}
      </p>
      <hr style="border-color:#1a5276;"/>
      [FULL READING TEXT — 180 to 220 words, 3–4 paragraphs]
      Bold the 8–10 vocabulary words from Resource 1 inline.
    </div>

    After the text, add READING ACTIVITIES:

    Task A — Pre-Reading (Before You Read):
    A 2-question prediction table:
    (columns: Question | My Prediction | What the text says)
    Questions: "What do you think this text is about?" and 
    "What do you already know about ${theme}?"

    Task B — While Reading (Find the Information):
    HTML table with 6 reading comprehension items 
    (3 factual / 3 inferential):
    (columns: # | Question | Paragraph # | My Answer)

    Task C — After Reading (Think and Discuss):
    HTML table with 3 higher-order thinking questions for pair/group work:
    (columns: Question | My Answer | My Partner's Answer)
    At least one question must connect to the students' own lives or Panama.

    Task D — Vocabulary in Context:
    Fill-in-the-blank activity using 6 bold words from the text.
    Format as a printable exercise card with the word bank shown.

    ─────────────────────────────────────────
    ✏️ RESOURCE 4 — GRAMMAR & LANGUAGE FOCUS (Stage 3: Preparation/Practice)
    ─────────────────────────────────────────
    Title: "Language Focus – Grammar Practice: ${theme}"
    
    Identify the KEY GRAMMAR STRUCTURE most relevant to ${skillsStr} and ${theme}.
    
    Deliver:
    
    Part 1 — Grammar Reference Card (mini table):
    (columns: Structure | Affirmative | Negative | Question form | Example from ${theme})
    Include 3 rows with different subjects/examples.
    
    Part 2 — Controlled Practice:
    HTML table exercise — "Complete the sentences using the correct form":
    8 sentences with blanks, word in parentheses, 
    answer column for self-correction.
    (columns: # | Sentence with blank | Word bank hint | Answer)
    
    Part 3 — Semi-Controlled Practice (Pair Work):
    HTML table — "Ask your partner! Use the grammar structure.":
    6 conversation starter prompts related to ${theme} in two columns
    (Student A column | Student B column)

    ─────────────────────────────────────────
    🎭 RESOURCE 5 — PERFORMANCE TASK CARD (Stage 4: Performance/Production)
    ─────────────────────────────────────────
    Title: "Your Mission: [Engaging Task Name related to ${theme}]"
    
    Format as a student task card:
    <div style="border:3px solid #1a5276; padding:20px; border-radius:10px; 
                background:linear-gradient(135deg, #eaf4fb, #fdfefe;">
      <h2 style="color:#1a5276;">🎭 YOUR MISSION</h2>
      <p><b>Scenario:</b> ${scenery}</p>
      <p><b>Your role:</b> [Define student's role in the task]</p>
      <p><b>Your task:</b> [Clear description of what they must produce — 
         presentation / dialogue / written piece / video script / poster, etc.]</p>
      <p><b>You must include:</b></p>
      [Bulleted checklist of 5–6 required language/content elements]
      <p><b>Time:</b> ___ minutes | <b>Format:</b> [Individual / Pairs / Groups of ___]</p>
    </div>

    Below the task card, include:
    - A SENTENCE STARTERS support box (8–10 phrases students can use during the task)
    - A SELF-CHECKLIST table before submitting:
    (columns: ✅ I included... | Yes | Not yet)
    List 6 criteria matching the task requirements.

    ─────────────────────────────────────────
    📊 RESOURCE 6 — EVALUATION RUBRIC (Stage 5: Assessment)
    ─────────────────────────────────────────
    Title: "Performance Assessment Rubric – ${theme} | Grade ${grade}"
    
    Deliver a COMPLETE 4-point rubric HTML table:
    
    <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:13px;">
      <thead>
        <tr style="background-color:#1a5276; color:white;">
          <th style="padding:10px; border:1px solid #ccccccde; width:15%;">Criteria</th>
          <th style="padding:10px; border:1px solid #cccccce3; width:22%;">
            4 – Excellent<br><span style="font-size:10px;">(90–100%)</span>
          </th>
          <th style="padding:10px; border:1px solid #cccccce8; width:22%;">
            3 – Proficient<br><span style="font-size:10px;">(75–89%)</span>
          </th>
          <th style="padding:10px; border:1px solid #cccccce1; width:22%;">
            2 – Developing<br><span style="font-size:10px;">(60–74%)</span>
          </th>
          <th style="padding:10px; border:1px solid #cccccccc; width:22%;">
            1 – Beginning<br><span style="font-size:10px;">(Below 60%)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        Row 1: Fluency & Delivery
        Row 2: Grammar Accuracy (focus on the structure from Resource 4)
        Row 3: Vocabulary Use (from the ${theme} vocabulary)
        Row 4: Comprehension & Content (relevance to task)
        Row 5: Interaction & Communication (if applicable to ${skillsStr})
        Row 6: Task Completion (met all requirements from Resource 5)
        [Use alternating row colors. Each cell must have 2–3 sentences of descriptor.]
      </tbody>
    </table>

    Below the rubric add:
    - Score calculator row: [Total: ___ / 24 points → Grade: ___]
    - A STUDENT SELF-ASSESSMENT version (same criteria, simplified language, 
      with smiley face scale: 😊 / 😐 / 😟)

    ─────────────────────────────────────────
    🔗 RESOURCE 7 — DIGITAL RESOURCES & EXTENSION ACTIVITIES
    ─────────────────────────────────────────
    Title: "Digital Tools & Extension Activities – ${theme}"

    Part 1 — Recommended Websites:
    HTML table with 5 resources:
    (columns: # | Website/Tool | URL | What it offers | How to use it in this lesson)
    All sites must be free, safe for students, and relevant to "${theme}".

    Part 2 — QR Activity Ideas:
    A simple table suggesting 3 ways to use QR codes in this lesson 
    (columns: QR Code Content | How students use it | AOA Stage)

    Part 3 — Fast Finisher / Extension Tasks:
    HTML table with 3 extra activities for students who finish early:
    (columns: Activity | Instructions | Skills practiced)
    Activities must be independent and require no teacher support.

    Part 4 — Cross-Curricular Connections:
    HTML table connecting "${theme}" to 3 other school subjects:
    (columns: Subject | Connection to ${theme} | Suggested activity)

    ════════════════════════════════════════
    FINAL FORMATTING RULES:
    ════════════════════════════════════════
    - Use color #1a5276 for all section headers.
    - Each resource must start with a colored header band:
      <div style="background:#1a5276; color:white; padding:12px 20px; 
                  border-radius:6px; margin:30px 0 15px 0; font-size:16px; font-weight:bold;">
        📘 RESOURCE [N°] — [TITLE]
      </div>
    - All tables must have hover-ready alternating row colors (#ffffff / #d6eaf8).
    - Add a printable footer on each resource: 
      "MEDUCA Panama | Grade ${grade} | Theme: ${theme} | Lesson ${lessonNum}"
    - Tone: Student-friendly for activities, Professional for rubrics.
    - PRODUCE ALL CONTENT IN FULL — no placeholders, no "[add here]", no ellipses.`,
      userMsg: `Generate the complete printable Resource Pack. Theme: "${theme}", Scenario: "${scenery}", Grade: "${grade}", Lesson: ${lessonNum}, Focus Skills: "${skillsStr}".`
    };
  }

  if (type === 'inter_tema') {
    const materiasStr = vars.materias?.join(', ') || 'Español, Ciencias Naturales, inglés';
    const trimestre = vars.trimestre || 'I Trimestre';
    const descripcion = vars.descripcion || '';
    return {
      systemPrompt: `Eres un experto en diseño curricular del Ministerio de Educación de Panamá (MEDUCA), especializado en proyectos interdisciplinarios.
Tu tarea es proponer UN TEMA GENERADOR creativo, relevante y contextualizado para un proyecto interdisciplinario .

El El tema debe:
- Ser pertinente al contexto panameño (biodiversidad, cultura, historia, sostenibilidad, identidad nacional, etc.)
- Conectar de manera natural y significativa las siguientes asignaturas: ${materiasStr}
- Ser apropiado para estudiantes de ${grade}
- Estar alineado al ${trimestre} del año escolar
- Partir de la siguiente descripción/interés del docente: "${descripcion}"
- Ser inspirador y motivante para los estudiantes y no debe ser un nombre demasiado largo (max 15 palabras)

Responde ÚNICAMENTE con un JSON en este formato exacto (sin markdown, sin explicaciones):
{"tema": "El nombre completo del tema generador", "pregunta_esencial": "Una pregunta esencial que guíe el proyecto (¿Cómo podemos...?)", "justificacion": "2 oraciones explicando por qué este tema es relevante para los estudiantes panameños de ${grade}"}`,
      userMsg: `Necesito un tema generador para un proyecto interdisciplinario. Descripción: "${vars.descripcion}". Grado: "${grade}". Asignaturas: "${materiasStr}". Trimestre: "${vars.trimestre}".`
    };
  }

  if (type === 'inter_formato') {
    const materiasStr = vars.materias?.join(', ') || 'Español, Ciencias Naturales';
    return {
      systemPrompt: `Eres un experto en diseño curricular del Ministerio de Educación de Panamá (MEDUCA).
Debes generar el FORMATO OFICIAL COMPLETO de la "Guía para el desarrollo de proyectos de aprendizajes interdisciplinarios" del MINISTERIO DE EDUCACIÓN de Panamá, siguiendo exactamente la estructura y las directrices del instructivo oficial de la institución.

REGLA CRÍTICA: Responde ÚNICAMENTE con HTML. Sin markdown, sin texto previo, sin explicaciones. Empieza directamente con <div>.

════════ ESTILO BASE (aplica a TODAS las tablas) ════════
- Todas las tablas: width:100%; border-collapse:collapse; margin-bottom:15px; font-family: Arial, sans-serif; font-size:12px;
- Todas las celdas td y th: border:1px solid #333; padding:8px 10px; vertical-align:top;
- Etiquetas (celdas izquierda): font-weight:bold; background:#f0f0f0; width:180px;
- El documento completo debe verse como el formulario oficial impreso de MEDUCA.
- Usa el color azul oscuro (#1a1a5e) para todos los encabezados y bordes destacados.

════════ ESTRUCTURA EXACTA DEL FORMATO ════════

▸ ENCABEZADO DEL DOCUMENTO
<div style="text-align:center; margin-bottom:15px; font-family:Arial,sans-serif;">
  <p style="font-size:13px; font-weight:bold; margin:2px 0; color:#1a1a5e;">MINISTERIO DE EDUCACIÓN</p>
  <p style="font-size:12px; font-weight:bold; margin:2px 0; color:#1a1a5e;">Guía para el desarrollo de proyectos de aprendizajes interdisciplinarios</p>
  <p style="font-size:12px; margin:2px 0; font-weight:bold;">Región escolar: \${vars.region || '_______________'}</p>
</div>

▸ TABLA 1 — DATOS DE IDENTIFICACIÓN
Genera una tabla con la siguiente información:
- Centro educativo: \${vars.escuela || '_______________'} | Docentes: \${vars.docente || '_______________'}
- Título del proyecto: (Debe ser un título atractivo, breve y claro que motive a los estudiantes, basado en "\${vars.temaGenerado || '_______________'}" para \${grade})
- Justificación: (Explicación breve de 3-4 oraciones indicando los motivos y la importancia del proyecto para estudiantes de \${grade} en Panamá)
- Duración: (Tiempo estimado en semanas, ej: "4 Semanas")
- Grado(s): \dots \${grade} | Trimestre: \${vars.trimestre || 'I Trimestre'}
- Asignaturas / Red: (Lista numerada de todas las asignaturas participantes: \dots \${materiasStr}, y finaliza con una fila o mención de "Otras" asignaturas de vinculación si aplica)

▸ TABLA 2 — OBJETIVO GENERAL DEL PROYECTO
Header: "Objetivo general del proyecto" (Fila de ancho completo en azul oscuro con letras blancas)
Body: (Una meta clara y medible que se desea lograr con el desarrollo del proyecto, que integre de forma natural las asignaturas: \${materiasStr} en torno a "\${vars.temaGenerado || '_______________'}" para \${grade})

▸ TABLA 3 — ELEMENTOS DEL CURRÍCULO (TABLA COMPARATIVA)
Crea una tabla con las columnas: [Elementos del currículo] | [Columna por cada asignatura en \${materiasStr}]
Las filas de elementos deben ser:
1. **Competencia(s):** Selecciona y lista explícitamente de entre las 9 competencias oficiales de MEDUCA aquellas que correspondan para cada asignatura:
   *(1) Comunicativa, (2) Razonamiento lógico-matemático, (3) Conocimiento e interacción con el mundo físico, (4) Tratamiento de la información y competencia digital, (5) Social y ciudadana, (6) Cultural y artística, (7) Aprender a aprender, (8) Autonomía e iniciativa personal, (9) Socioemocional y Emprendimiento.*
2. **Objetivo(s) de aprendizaje(s):** Extrae de forma realista del programa oficial de estudios de MEDUCA para \${grade} los objetivos correspondientes al tema.
3. **Indicador(es) de logro:** Extrae de forma realista del programa oficial para \${grade} los indicadores correspondientes.
4. **Tema(s) / Contenido(s):** Extrae de forma realista los contenidos conceptuales, procedimentales y actitudinales aplicables.
5. **Herramientas tecnológicas de apoyo:** Recursos digitales y herramientas colaborativas específicas (ej. Padlet, Canva, GeoGebra, Kahoot) que apoyen el desarrollo del proyecto en cada asignatura.

▸ TABLA 4 — FASES DEL PROYECTO
Crea una tabla con las columnas: [Fases del proyecto] [Actividades (Breve descripción)] [Semana 1] [Semana 2] [Semana 3] [Semana 4 / n]
Las filas de fases deben detallar lo siguiente (describe brevemente 1-2 actividades por fase en la columna de descripción):
1. **Planificación:** Determinar el plan de actividades a realizar, sensibilización, conformación de equipos.
2. **Ejecución:** Desarrollo de tareas, investigación de campo y producción de entregables/producto del proyecto.
3. **Monitoreo y evaluación:** Progreso y ajustes necesarios del proyecto durante el desarrollo.
4. **Cierre:** Demostración pública de lo aprendido por parte de los estudiantes (ej: feria científica, panel de exposición, mural).
Marca con una "X" las semanas correspondientes a cada actividad en las columnas semanales.

▸ TABLA 5 — CRONOGRAMA DE ACTIVIDADES
Crea una tabla detallada con las columnas: [Actividades (Solamente coloque el nombre de la actividad)] [Mes: ___ (S-1 | S-2 | S-3 | S-4)] [Mes: ___ (S-1 | S-2 | S-3 | S-4)]
Mínimo 6 actividades del proyecto listadas de forma consecutiva (ej: 1. Presentación, 2. Investigación de campo, 3. Diseño del prototipo, 4. Redacción del informe, 5. Montaje, 6. Exposición pública).
Coloca una "X" en la columna de la semana en la que se planifica ejecutar cada actividad.

▸ TABLA 6 — INSTRUMENTOS DE EVALUACIÓN Y CRITERIOS
Header: "Instrumentos de evaluación y criterios" (Azul oscuro con letras blancas)
Body: (Lista detallada de los instrumentos de evaluación, ej. rúbrica de proyecto, lista de cotejo para el trabajo colaborativo, y define los criterios de evaluación de desempeño basados en los indicadores de logro descritos).

▸ TABLA 7 — REFERENCIAS BIBLIOGRÁFICAS
Header: "Referencias bibliográficas"
Body: (Lista de 4-5 fuentes reales y actualizadas en formato APA, incluyendo programas oficiales de MEDUCA y fuentes de investigación específicas del tema).

▸ TABLA 8 — OBSERVACIONES
Header: "Observaciones"
Body: (2-3 señalamientos pedagógicos relevantes que aborden fortalezas, debilidades o sugerencias de adecuaciones durante las fases de planificación, ejecución y evaluación).

▸ SECCIÓN DE FIRMAS (PIE DE PÁGINA)
Crea una estructura de tres columnas con la siguiente distribución para firmas oficiales:
- Docentes responsables: Nombre: \${vars.docente || '_______________'} | Firma: ______________________
- Coordinadores: Nombre: ______________________ | Firma: ______________________
- Director (a)/subdirector (a): Nombre: ______________________ | Firma: ______________________

REGLAS CRÍTICAS DE CALIDAD:
- No dejes ningún campo en blanco, con marcadores de posición como "[completar]" ni uses puntos supposiciones ("..."). Genera todo el contenido pedagógico en su totalidad.
- Asegúrate de que el contenido sea plenamente panameño y adaptado al nivel de \${grade}.
- Respeta estrictamente el formato HTML de inicio a fin.`,
      userMsg: `Genera el FORMATO OFICIAL MEDUCA completo para el proyecto interdisciplinario. Tema: "\${vars.temaGenerado || '_______________'}". Grado: \${grade}. Asignaturas: \${materiasStr}. Trimestre: \${vars.trimestre || 'I Trimestre'}. Escuela: \${vars.escuela || '_______________'}. Docente: \${vars.docente || '_______________'}. Región: \${vars.region || '_______________'}. Año: \${vars.anio || '2026'}.`
    };
  }

  if (type === 'theme_planner') {
    const focusType = vars.themeType === 'receptive' ? 'Receptive (Listening/Reading focus)' : 'Interactive (Speaking/Writing focus)';
    const scenarioNum = parseInt(vars.scenarioNum || '1');
    const isReceptive = vars.themeType === 'receptive';

    // ──── CURRICULUM JSON DATA (Dynamic or Pre-extracted fallback) ────
    let scenarioData = vars.scenarioData;

    if (!scenarioData) {
      // Fallback Grade 4 scenarios
      const curriculumScenarios = {
        1: { scenarioName: 'A Walk in the Neighborhood', theme1: 'This Is My Favorite.', theme2: 'It\'s the Best!', grammar: ['1. Superlatives (e.g., "This school is the best.")', '2. Simple present + conjunction: (e.g., "I like this park because it is fun.")', '3. Question structure (e.g., "What is your favorite?")'], vocabulary: { nouns: ['neighborhood', 'park', 'place', 'tree', 'flower', 'building', 'street', 'path', 'playground'], verbs: ['walk', 'explore', 'visit', 'see', 'enjoy', 'like', 'share', 'hear', 'prefer', 'observe', 'ride', 'run', 'play'] }, pragmatic: ['Describing preferences: "This is my favorite."', 'Expressing opinions: "I like this park because it is fun."', 'Discourse marker: Because (e.g., "I like this park because it is fun.")'], sociolinguistic: ['Explaining opinions: Using "because" to justify preferences in familiar contexts.'] },
        2: { scenarioName: 'Helping in the Garden', theme1: 'The Tomatoes Grow Quickly.', theme2: 'These Plants Are from Panama.', grammar: ['1. Present simple + \'s\' (e.g., "How often does María water the plants?" "María waters the plants every day.")', '2. Demonstratives (e.g., "These are tomatoes, and this is a tomato plant.")', '3. Question forms (e.g., "How often do you water the plants?" "Do you like watering the plants?")'], vocabulary: { nouns: ['garden', 'plant', 'tomato', 'seed', 'soil', 'watering can', 'flower', 'vegetable', 'sunlight', 'hose', 'rainwater'], verbs: ['grow', 'water', 'plant', 'harvest', 'bloom', 'care', 'dig', 'need', 'put', 'add', 'cover'] }, pragmatic: ['Describing gardening steps: "First, plant the seeds."', 'Describing routines: "I water the plants every day."', 'Expressing preferences: like, don\'t like', 'Discourse markers: and, but'], sociolinguistic: ['Describing simple gardening instructions: Using conjunctions to describe gardening tasks.'] },
        3: { scenarioName: 'Shopping at the Market', theme1: 'How Much Is the Pineapple?', theme2: 'I Need Five Yucas.', grammar: ['1. WH-Questions (e.g., "How much is it?")', '2. Quantities (e.g., "I need five potatoes.")', '3. Present Simple (e.g., "I want three apples and one banana.")'], vocabulary: { nouns: ['market', 'price', 'shopping list', 'item', 'store', 'cost', 'pineapple', 'cashier', 'money', 'cassava', 'potatoes'], verbs: ['buy', 'sell', 'ask', 'pay', 'choose', 'compare', 'need', 'want', 'get', 'cost', 'help'] }, pragmatic: ['Asking about prices: "How much is the pineapple?"', 'Describing quantities: "I need five apples."', 'Discourse marker: "I need two apples and four bananas."'], sociolinguistic: ['Expressing needs: Using polite expressions to talk about shopping and prices.'] },
        4: { scenarioName: 'Visiting the Panama Canal', theme1: 'The Vessels Are Big Because...', theme2: 'A Vessel Is Crossing!', grammar: ['1. Present simple with affirmative and interrogative sentences', '2. Present continuous with affirmative and interrogative sentences', '3. Comparatives and superlatives'], vocabulary: { nouns: ['canal', 'boat', 'ocean', 'bridge', 'current', 'vessel', 'ship', 'yacht', 'goods', 'locks'], verbs: ['travel', 'connect', 'observe', 'see', 'visit'] }, pragmatic: ['Describing current events', 'Comparing things', 'Describing facts', 'Discourse marker: connections'], sociolinguistic: ['Respectful Conversations: Engaging in polite exchanges.'] },
        5: { scenarioName: 'A Trip to the Beach', theme1: 'Let\'s Pack for a Trip.', theme2: 'I Always Pack Lunch.', grammar: ['1. Present simple in affirmative and question forms', '2. Imperatives (e.g., "Please, bring your swimsuit.")', '3. Going to (e.g., "I am going to the beach this weekend.")'], vocabulary: { nouns: ['beach', 'towel', 'sunscreen', 'sand', 'shell', 'wave', 'bucket', 'picnic', 'sun', 'umbrella'], verbs: ['swim', 'relax', 'build', 'collect', 'sunbathe', 'run', 'plan', 'bring', 'pack', 'forget'] }, pragmatic: ['Describing trips: "I always pack lunch for the trip."', 'Describing routines: "We go to the beach every Saturday."'], sociolinguistic: ['Giving instructions politely: Communicating instructions politely when using imperative forms.'] },
        6: { scenarioName: 'It\'s the Rainy Season', theme1: 'Where\'s the Puddle?', theme2: 'I Need an Umbrella.', grammar: ['1. Present simple (e.g., "What do you need?" "I need an umbrella.")', '2. Present continuous (e.g., "It is raining today.")', '3. WH-questions (e.g., "What do you wear in the rain?")'], vocabulary: { nouns: ['puddle', 'umbrella', 'raincoat', 'boots', 'sandals', 'storm', 'cloud', 'sky', 'lightning', 'thunder'], verbs: ['splash', 'drop', 'pour', 'need', 'want', 'puddle-jump', 'flood'] }, pragmatic: ['Talking about rainy weather: "I need an umbrella."', 'Sharing experiences: "I wear my boots when it rains."'], sociolinguistic: ['Narrating current events related to weather: Using the present continuous tense.'] },
        7: { scenarioName: 'The Beautiful Mola', theme1: 'A Mola Has Many Colors!', theme2: 'I Can Make a Mola.', grammar: ['1. Subordinating conjunction "because" to prove a reason', '2. Present simple (e.g., "A mola has...")', '3. Instructional steps (e.g., "First, cut the fabric...")'], vocabulary: { nouns: ['mola', 'creativity', 'project', 'inspiration', 'culture', 'turtle', 'butterfly', 'jaguar'], verbs: ['cut', 'sew', 'paste', 'choose', 'express', 'illustrate', 'decorate', 'collaborate'] }, pragmatic: ['Describing things: "A mola has many colors."', 'Describing project steps: Using instructional language', 'Expressing preferences: "I like this mola because it has many shapes."'], sociolinguistic: ['Participating in collaborative art-making: Acknowledging peers\' contributions.'] },
        8: { scenarioName: 'Our Traditional Style of Dress', theme1: 'She Is Wearing a Pollera.', theme2: 'Let\'s Dress for a Dance.', grammar: ['1. Present continuous (e.g., "She is wearing...")', '2. WH-questions (e.g., "What are you wearing?")', '3. Present simple (e.g., "Women wear this dress at festivals.")'], vocabulary: { nouns: ['attire', 'celebration', 'event', 'community', 'traditional clothing', 'jewelry'], verbs: ['showcase', 'represent', 'explain', 'admire', 'dress', 'use', 'wear', 'fold', 'sew'] }, pragmatic: ['Describing traditional clothing: "She is wearing a pollera."', 'Explaining cultural significance: "Polleras are worn at festivals."'], sociolinguistic: ['Discussing traditions: Describing different traditional clothing designs.'] }
      };
      scenarioData = curriculumScenarios[scenarioNum] || { scenarioName: `Scenario ${scenarioNum}`, theme1: 'Theme 1', theme2: 'Theme 2', grammar: [], vocabulary: {}, pragmatic: [], sociolinguistic: [] };
    }

    const themeName = isReceptive
      ? (scenarioData.theme1 || scenarioData.themeName)
      : (scenarioData.theme2 || scenarioData.themeName);

    const grammarList = scenarioData.grammar || scenarioData.communicativeCompetences?.linguistic?.grammaticalFeatures || [];
    const grammarStr = grammarList.join('\n') || 'Grammar structures relevant to the theme';

    const vocabularyObj = scenarioData.vocabulary || scenarioData.communicativeCompetences?.linguistic?.vocabulary || {};
    const vocabStr = Object.entries(vocabularyObj).map(([k, v]) => {
      const items = Array.isArray(v) ? v.join(', ') : (typeof v === 'string' ? v : JSON.stringify(v));
      return `${k}: ${items}`;
    }).join('\n') || 'Vocabulary from the theme';

    const pragmaticList = scenarioData.pragmatic || scenarioData.communicativeCompetences?.pragmatic?.functions || [];
    const pragmaticStr = pragmaticList.join('\n') || 'Communicative functions from the theme';

    const socioList = scenarioData.sociolinguistic || scenarioData.communicativeCompetences?.sociolinguistic?.elements || [];
    const socioStr = socioList.join('\n') || 'Sociolinguistic elements from the theme';

    const project21st = scenarioData.project21stCentury || scenarioData.communicativeCompetences?.linguistic?.project21stCentury || '21st Century Project relevant to the theme';

    return {
      systemPrompt: `You are an expert EFL curriculum designer certified by MEDUCA, specializing in the Action-Oriented Approach (AOA) for Panama's English curriculum.

Your task: Generate a COMPLETE Theme Planner following the official MEDUCA Panama template, using the curriculum data provided below.

CRITICAL: Respond ONLY with HTML. No markdown, no preamble. Start directly with <div>.
CRITICAL: Copy grammar, vocabulary, and language elements EXACTLY from the curriculum data below. Do NOT invent.

════════ CURRICULUM DATA FOR SCENARIO ${scenarioNum} ════════
SCENARIO: ${scenarioData.scenarioName}
THEME (${isReceptive ? 'Theme 1 - Receptive' : 'Theme 2 - Interactive'}): ${themeName}
FOCUS TYPE: ${focusType}

RECOMMENDED GRAMMATICAL FEATURES:
${grammarStr}

RECOMMENDED VOCABULARY:
${vocabStr}

PRAGMATIC COMPETENCES (Communicative Functions):
${pragmaticStr}

SOCIOLINGUISTIC COMPETENCES:
${socioStr}

21ST CENTURY PROJECT:
${project21st}

════════ YOUR TASK ════════
Fill ALL 6 sections of the Theme Planner:

1. GENERAL INFORMATION — Use provided teacher, school, grade, CEFR, trimester, weeks
2. STANDARDS & LEARNING OUTCOMES — Copy the focus skills and create specific standards (extracted from curriculum.js file)
3. COMMUNICATIVE COMPETENCES — Copy the grammar, vocabulary, pragmatic & sociolinguistic elements ABOVE into the 3-column table, then add "project21stCentury" as the 4th column
4. SPECIFIC OBJECTIVES — Generate SMART objectives for all 5 skills (Listening, Reading, Speaking, Writing, Mediation)
5. MATERIALS & DIFFERENTIATION — List 8-10 materials and DLN strategies
6. LEARNING SEQUENCE — Design 5 lessons (Listening, Reading, Speaking, Writing, Mediation focus)

════════ HTML FORMATTING ════════
- Header: MINISTRY OF EDUCATION / REGIONAL EDUCATION DIRECTORATE / SCHOOL / Theme Planner #
- All tables: width:100%; border-collapse:collapse; font-family:Arial; font-size:12px
- Cells: border:1px solid #333; padding:8px 10px
- Section titles: background:#1a3a5c; color:white; bold
- No placeholders. Every field must be filled with real content.`,

      userMsg: `Generate the complete official MEDUCA Panama Theme Planner #${vars.plannerNum}.

DATA:
- Teacher: ${vars.teacher || '___'}
- School: ${vars.school || '___'}
- Region: ${vars.region || '___'}
- Grade: ${grade}
- CEFR Level: ${vars.cefr || 'A1.2'}
- Trimester: ${vars.trimester || '1st'}
- Weekly Hours: ${vars.weeklyHrs || '5'}
- Weeks: ${vars.weeks || '2'}
- Scenario #${scenarioNum}: "${scenarioData.scenarioName}"
- Theme: "${themeName}"
- Focus Type: ${focusType}
- Target Skills: ${skillsStr}

Produce the full HTML planner now. Use the curriculum data from the system prompt for Section 3.`
    };
  }

  return { systemPrompt: '', userMsg: '' };
}
