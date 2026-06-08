const https = require('https');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function sendResendEmail(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function buildEmailHtml({ customer, order_id, payment_id, amountRupees, itemsHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed - Body Bloomer</title>
</head>
<body style="margin:0;padding:0;background:#f9f5f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#8B6F47,#c4a07a);padding:36px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:bold;color:#fff;letter-spacing:1px;">🌿 Body Bloomer by Remya</div>
            <div style="color:#f5e6d3;font-size:14px;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">Handcrafted Natural Skincare</div>
          </td>
        </tr>

        <!-- Thank you message -->
        <tr>
          <td style="padding:36px 40px 20px;text-align:center;">
            <div style="font-size:22px;color:#5a3e2b;font-weight:bold;">Thank you for your order, ${customer.name || 'dear customer'}! 💛</div>
            <p style="color:#7a6652;font-size:15px;line-height:1.7;margin-top:12px;">
              Placing an order with a small, handmade business means the world to us.<br/>
              Every soap you've chosen is crafted with care, love, and only the purest natural ingredients — <strong>your skin is in good hands!</strong>
            </p>
          </td>
        </tr>

        <!-- Order confirmed badge -->
        <tr>
          <td style="padding:0 40px;">
            <div style="background:#f0faf0;border:1.5px solid #7bc47b;border-radius:8px;padding:14px 20px;text-align:center;font-size:16px;color:#2e7d32;font-weight:bold;">
              ✅ Order Confirmed
            </div>
          </td>
        </tr>

        <!-- Order details table -->
        <tr>
          <td style="padding:24px 40px 0;">
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
              <tr style="background:#faf6f1;">
                <td style="padding:10px 14px;color:#8B6F47;font-weight:bold;border-radius:6px 0 0 6px;">Order ID</td>
                <td style="padding:10px 14px;color:#3d2b1f;font-family:monospace;">${order_id}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;color:#8B6F47;font-weight:bold;">Payment ID</td>
                <td style="padding:10px 14px;color:#3d2b1f;font-family:monospace;">${payment_id}</td>
              </tr>
              <tr style="background:#faf6f1;">
                <td style="padding:10px 14px;color:#8B6F47;font-weight:bold;">Amount Paid</td>
                <td style="padding:10px 14px;color:#3d2b1f;font-weight:bold;">₹${amountRupees}/-</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Items ordered -->
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="font-size:15px;font-weight:bold;color:#5a3e2b;margin-bottom:10px;">🛒 Your Items</div>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;background:#faf6f1;border-radius:8px;">
              ${itemsHtml}
            </table>
          </td>
        </tr>

        <!-- Delivery details -->
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="font-size:15px;font-weight:bold;color:#5a3e2b;margin-bottom:10px;">📦 Delivering To</div>
            <div style="background:#faf6f1;border-radius:8px;padding:14px 18px;font-size:14px;color:#3d2b1f;line-height:1.8;">
              <strong>${customer.name || 'N/A'}</strong><br/>
              ${customer.address || 'N/A'}<br/>
              ${customer.phone || 'N/A'}
            </div>
          </td>
        </tr>

        <!-- Shipping info -->
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="background:#fff8f0;border-left:4px solid #8B6F47;border-radius:0 8px 8px 0;padding:14px 18px;font-size:14px;color:#5a3e2b;line-height:1.8;">
              📅 Your order will be <strong>packed and shipped within 2–3 business days.</strong><br/><br/>
              💬 For shipping updates, reach us on:<br/>
              &nbsp;&nbsp;&nbsp;WhatsApp: <strong>+91 88487 37295</strong><br/>
              &nbsp;&nbsp;&nbsp;Email: <strong>bodybloomer2@gmail.com</strong>
            </div>
          </td>
        </tr>

        <!-- Footer message -->
        <tr>
          <td style="padding:32px 40px;text-align:center;border-top:1px solid #f0e8df;margin-top:24px;">
            <p style="color:#9c7c5a;font-size:14px;line-height:1.8;font-style:italic;">
              Thank you for supporting a small, homegrown business.<br/>
              Every order keeps this dream alive.
            </p>
            <p style="color:#8B6F47;font-size:15px;font-weight:bold;margin-top:8px;">
              With love,<br/>Body Bloomer by Remya 🌿
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { payment_id, order_id, amount, customer, items } = body;

  if (!payment_id || !customer || !customer.email) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing order details or customer email' }) };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  const ownerEmail = process.env.BUSINESS_EMAIL || 'bodybloomer2@gmail.com';
  const amountRupees = amount ? (amount / 100).toFixed(2) : '0.00';

  let parsedItems = [];
  try {
    parsedItems = typeof items === 'string' ? JSON.parse(items) : (Array.isArray(items) ? items : []);
  } catch { parsedItems = []; }

  const itemsHtml = parsedItems.length > 0
    ? parsedItems.map((item, i) =>
        `<tr style="${i % 2 === 0 ? '' : 'background:#fff;'}">
          <td style="padding:10px 14px;color:#3d2b1f;">${item.name || 'Item'} × ${item.qty || 1}</td>
          <td style="padding:10px 14px;color:#5a3e2b;text-align:right;font-weight:bold;">₹${item.price || 0}/-</td>
        </tr>`
      ).join('')
    : `<tr><td colspan="2" style="padding:10px 14px;color:#9c7c5a;">Order items not available</td></tr>`;

  const htmlContent = buildEmailHtml({ customer, order_id, payment_id, amountRupees, itemsHtml });

  const emailPayload = {
    from: 'Body Bloomer by Remya <onboarding@resend.dev>',
    to: [customer.email],
    cc: [ownerEmail],
    subject: `🌿 Your Body Bloomer Order is Confirmed! #${order_id}`,
    html: htmlContent,
  };

  try {
    const result = await sendResendEmail(emailPayload, resendApiKey);
    console.log('Resend email result:', result);

    if (result.status === 200 || result.status === 201) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ notified: true, email_id: result.data.id, payment_id, order_id }),
      };
    } else {
      console.error('Resend API error:', result);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to send email', details: result.data }),
      };
    }
  } catch (err) {
    console.error('Email send error:', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Email sending failed' }) };
  }
};
