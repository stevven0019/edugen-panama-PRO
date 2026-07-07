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

  const { eventType, details } = req.body;
  if (!eventType) {
    return res.status(400).json({ error: 'eventType is required' });
  }

  const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.VITE_ADMIN_EMAIL || 'estebanquint@gmail.com';

  // Build subject and HTML based on eventType
  let emailSubject = '🔔 Alerta de Administrador: EduGen Panama';
  let emailHtml = '';

  const timestamp = new Date().toLocaleString('es-PA', { timeZone: 'America/Panama' });

  if (eventType === 'registration') {
    const userEmail = details?.email || 'Desconocido';
    const provider = details?.provider || 'No especificado';
    const mode = details?.mode || 'No especificado';
    
    emailSubject = '🔔 EduGen Panama: Nuevo Registro de Usuario';
    emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
          .card { background: white; max-width: 600px; margin: 20px auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
          .field { margin-bottom: 12px; font-size: 14px; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #0f172a; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="title">👤 Nuevo Registro de Usuario</span>
          </div>
          <div class="field">
            <span class="label">Correo del Usuario:</span>
            <span class="value">${userEmail}</span>
          </div>
          <div class="field">
            <span class="label">Proveedor / Método:</span>
            <span class="value">${provider}</span>
          </div>
          <div class="field">
            <span class="label">Modo de Ejecución:</span>
            <span class="value">${mode}</span>
          </div>
          <div class="field">
            <span class="label">Fecha y Hora (Panamá):</span>
            <span class="value">${timestamp}</span>
          </div>
          <div class="footer">
            EduGen Panama SaaS • Consola de Administración
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (eventType === 'plan_generation') {
    const userEmail = details?.email || 'Desconocido';
    const planId = details?.planId || 'N/A';
    const title = details?.title || 'Sin Título';
    const planType = details?.type || 'No especificado';
    const grade = details?.grade || 'No especificado';
    const mode = details?.mode || 'No especificado';

    emailSubject = `📝 EduGen Panama: Nueva Planificación (${planType})`;
    emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
          .card { background: white; max-width: 600px; margin: 20px auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #065f46; }
          .field { margin-bottom: 12px; font-size: 14px; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #0f172a; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="title">📝 Planificación Generada</span>
          </div>
          <div class="field">
            <span class="label">Creado por (Usuario):</span>
            <span class="value">${userEmail}</span>
          </div>
          <div class="field">
            <span class="label">Título del Plan:</span>
            <span class="value">${title}</span>
          </div>
          <div class="field">
            <span class="label">Tipo de Plan:</span>
            <span class="value">${planType}</span>
          </div>
          <div class="field">
            <span class="label">Grado:</span>
            <span class="value">${grade}</span>
          </div>
          <div class="field">
            <span class="label">ID del Plan:</span>
            <span class="value">${planId}</span>
          </div>
          <div class="field">
            <span class="label">Modo:</span>
            <span class="value">${mode}</span>
          </div>
          <div class="field">
            <span class="label">Fecha y Hora (Panamá):</span>
            <span class="value">${timestamp}</span>
          </div>
          <div class="footer">
            EduGen Panama SaaS • Consola de Administración
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (eventType === 'payment_submitted') {
    const userEmail = details?.email || 'Desconocido';
    const paymentId = details?.paymentId || 'N/A';
    const productType = details?.productType || 'No especificado';
    const tokenQuantity = details?.tokenQuantity || 0;
    const amount = details?.amount || 0;
    const refId = details?.refId || 'N/A';
    const screenshot = details?.screenshot || '';
    const mode = details?.mode || 'No especificado';

    emailSubject = '💰 EduGen Panama: Comprobante de Pago Recibido';
    emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
          .card { background: white; max-width: 600px; margin: 20px auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #92400e; }
          .field { margin-bottom: 12px; font-size: 14px; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #0f172a; }
          .screenshot-box { margin-top: 20px; border: 1px dashed #cbd5e1; padding: 10px; text-align: center; background: #f1f5f9; border-radius: 8px; }
          .screenshot-img { max-width: 100%; max-height: 400px; border-radius: 4px; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="title">💰 Comprobante de Pago Cargado</span>
          </div>
          <div class="field">
            <span class="label">Usuario:</span>
            <span class="value">${userEmail}</span>
          </div>
          <div class="field">
            <span class="label">Producto:</span>
            <span class="value">${productType === 'subscription' ? 'Suscripción Premium' : 'Paquete de Tokens'}</span>
          </div>
          <div class="field">
            <span class="label">Tokens Solicitados:</span>
            <span class="value">${tokenQuantity}</span>
          </div>
          <div class="field">
            <span class="label">Monto Cargado:</span>
            <span class="value">$${amount} USD</span>
          </div>
          <div class="field">
            <span class="label">ID de Referencia:</span>
            <span class="value">${refId}</span>
          </div>
          <div class="field">
            <span class="label">ID del Pago:</span>
            <span class="value">${paymentId}</span>
          </div>
          <div class="field">
            <span class="label">Modo:</span>
            <span class="value">${mode}</span>
          </div>
          <div class="field">
            <span class="label">Fecha y Hora (Panamá):</span>
            <span class="value">${timestamp}</span>
          </div>
          ${screenshot ? `
          <div class="screenshot-box">
            <p style="font-weight: bold; margin-top: 0; color: #475569;">Captura del Comprobante:</p>
            <img src="${screenshot}" class="screenshot-img" alt="Comprobante de Pago" />
          </div>
          ` : '<p style="color: red; font-weight: bold; margin-top: 20px;">Sin captura de pantalla cargada.</p>'}
          <div class="footer">
            EduGen Panama SaaS • Consola de Administración
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (eventType === 'comment_submitted') {
    const commentId = details?.commentId || 'N/A';
    const name = details?.name || 'Anónimo';
    const school = details?.school || 'No especificado';
    const region = details?.region || 'No especificado';
    const text = details?.text || '';
    const mode = details?.mode || 'No especificado';

    emailSubject = '💬 EduGen Panama: Nuevo Comentario o Testimonio';
    emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
          .card { background: white; max-width: 600px; margin: 20px auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #5b21b6; }
          .field { margin-bottom: 12px; font-size: 14px; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #0f172a; }
          .comment-box { margin-top: 20px; border-left: 4px solid #8b5cf6; padding: 15px; background: #f9f5ff; font-style: italic; border-radius: 0 8px 8px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="title">💬 Testimonio o Comentario Publicado</span>
          </div>
          <div class="field">
            <span class="label">Nombre del Docente:</span>
            <span class="value">${name}</span>
          </div>
          <div class="field">
            <span class="label">Escuela:</span>
            <span class="value">${school}</span>
          </div>
          <div class="field">
            <span class="label">Región Educativa:</span>
            <span class="value">${region}</span>
          </div>
          <div class="field">
            <span class="label">ID de Comentario:</span>
            <span class="value">${commentId}</span>
          </div>
          <div class="field">
            <span class="label">Modo:</span>
            <span class="value">${mode}</span>
          </div>
          <div class="field">
            <span class="label">Fecha y Hora (Panamá):</span>
            <span class="value">${timestamp}</span>
          </div>
          <div class="comment-box">
            "${text}"
          </div>
          <div class="footer">
            EduGen Panama SaaS • Consola de Administración
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 1. Resend Integration
  if (resendApiKey) {
    try {
      console.log(`Sending admin notification (${eventType}) to ${adminEmail} via Resend...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'EduGen Admin Alerts <no-reply@edugen.pro>',
          to: [adminEmail],
          subject: emailSubject,
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Resend API returned status ${response.status}: ${errorDetails}`);
      }

      const data = await response.json();
      return res.status(200).json({ success: true, provider: 'resend', data });
    } catch (err) {
      console.error('Error sending admin notification via Resend:', err);
      return res.status(500).json({ error: 'Failed to send notification via Resend', details: err.message });
    }
  }

  // 2. SMTP (Nodemailer) Integration
  if (smtpHost && smtpUser && smtpPass) {
    try {
      console.log(`Sending admin notification (${eventType}) to ${adminEmail} via SMTP...`);
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"EduGen Admin Alerts" <${smtpUser}>`,
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml
      });

      return res.status(200).json({ success: true, provider: 'smtp', messageId: info.messageId });
    } catch (err) {
      console.error('Error sending admin notification via SMTP:', err);
      return res.status(500).json({ error: 'Failed to send notification via SMTP', details: err.message });
    }
  }

  // 3. Fallback
  console.warn(`Admin notification not sent because no provider (RESEND_API_KEY or SMTP_*) is configured.`);
  return res.status(200).json({ 
    success: false, 
    message: 'Notification endpoint hit, but no email provider is configured.' 
  });
}
