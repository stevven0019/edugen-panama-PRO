export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const emailSubject = '¡Bienvenido a EduGen Panama! 🇵🇦';
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
      .card { background: white; max-width: 600px; margin: 20px auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      .header { text-align: center; margin-bottom: 30px; }
      .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
      h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; }
      p { font-size: 14px; line-height: 1.6; color: #475569; }
      .btn-container { text-align: center; margin: 30px 0; }
      .btn { display: inline-block; background-color: #2563eb; color: white !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; }
      .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <span class="logo">EduGen Panama 🇵🇦</span>
      </div>
      <h1>¡Bienvenido a EduGen Panama, Docente!</h1>
      <p>Nos alegra muchísimo que te unas a nuestra comunidad de educadores innovadores.</p>
      <p>EduGen Panama está diseñado especialmente para simplificar tu planificación curricular, ayudándote a estructurar tus formatos AOA, planes trimestrales (Theme Planner) y proyectos interdisciplinarios alineados con MEDUCA en cuestión de minutos.</p>
      <p>Como nuevo usuario, has recibido <strong>3 tokens de prueba gratuitos</strong> para que explores todas las funcionalidades de la plataforma.</p>
      <div class="btn-container">
        <a href="https://edugen.pro" class="btn" target="_blank">Comenzar a Planificar</a>
      </div>
      <p style="margin-top: 30px;">Si tienes alguna pregunta o sugerencia, no dudes en responder a este correo.</p>
      <p>¡Mucho éxito en este año escolar!</p>
      <p>El equipo de EduGen Panama</p>
      <div class="footer">
        &copy; 2026 EduGen Panama. Todos los derechos reservados.<br>
        Este es un correo automático, por favor no respondas directamente si no necesitas asistencia.
      </div>
    </div>
  </body>
  </html>
  `;

  // 1. Resend Integration
  if (resendApiKey) {
    try {
      console.log(\`Sending welcome email to \${email} via Resend...\`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${resendApiKey}\`
        },
        body: JSON.stringify({
          from: 'EduGen Panama <no-reply@edugen.pro>',
          to: [email],
          subject: emailSubject,
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(\`Resend API returned status \${response.status}: \${errorDetails}\`);
      }

      const data = await response.json();
      return res.status(200).json({ success: true, provider: 'resend', data });
    } catch (err) {
      console.error('Error sending welcome email via Resend:', err);
      return res.status(500).json({ error: 'Failed to send email via Resend', details: err.message });
    }
  }

  // 2. SMTP (Nodemailer) Integration
  if (smtpHost && smtpUser && smtpPass) {
    try {
      console.log(\`Sending welcome email to \${email} via SMTP...\`);
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: \`"EduGen Panama" <\${smtpUser}>\`,
        to: email,
        subject: emailSubject,
        html: emailHtml
      });

      return res.status(200).json({ success: true, provider: 'smtp', messageId: info.messageId });
    } catch (err) {
      console.error('Error sending welcome email via SMTP:', err);
      return res.status(500).json({ error: 'Failed to send email via SMTP', details: err.message });
    }
  }

  // 3. Fallback: No credentials configured
  console.warn(\`Welcome email not sent to \${email} because no email provider credentials (RESEND_API_KEY or SMTP_*) are configured.\`);
  return res.status(200).json({ 
    success: false, 
    message: 'Welcome email API is live, but no email provider is configured yet. Please configure RESEND_API_KEY or SMTP_* env variables.' 
  });
}
