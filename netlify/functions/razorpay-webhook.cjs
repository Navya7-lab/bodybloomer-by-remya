const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(event.body)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return { statusCode: 400, body: 'Invalid signature' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  console.log('Razorpay webhook:', payload.event);

  if (payload.event === 'payment.captured') {
    const payment = payload.payload.payment.entity;
    console.log('Payment captured:', {
      payment_id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      email: payment.email,
      contact: payment.contact,
    });
  }

  return { statusCode: 200, body: 'OK' };
};
