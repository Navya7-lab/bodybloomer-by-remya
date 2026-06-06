const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { payment_id, order_id, amount, customer, items } = body;

  if (!payment_id || !customer) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing order details' }),
    };
  }

  const ownerPhone = process.env.BUSINESS_WHATSAPP || '+918848737295';
  const ownerEmail = process.env.BUSINESS_EMAIL || 'bodybloomer2@gmail.com';

  const amountRupees = amount ? (amount / 100).toFixed(2) : '0.00';

  let itemsText = '';
  try {
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    if (Array.isArray(parsedItems)) {
      itemsText = parsedItems.map(i => `${i.name} x${i.qty} (Rs. ${i.price}/-)`).join('\n');
    }
  } catch {
    itemsText = String(items);
  }

  const msg = `*New Order - Body Bloomer*

` +
    `*Amount:* Rs. ${amountRupees}/-\n` +
    `*Payment ID:* ${payment_id}\n` +
    `*Order ID:* ${order_id}\n\n` +
    `*Customer Details:*\n` +
    `Name: ${customer.name || 'N/A'}\n` +
    `Email: ${customer.email || 'N/A'}\n` +
    `Phone: ${customer.phone || 'N/A'}\n` +
    `Address: ${customer.address || 'N/A'}\n\n` +
    `*Items Ordered:*\n${itemsText || 'N/A'}`;

  const whatsappUrl = `https://wa.me/${ownerPhone.replace('+', '')}?text=${encodeURIComponent(msg)}`;

  console.log('ORDER NOTIFICATION:', {
    payment_id,
    order_id,
    amount: amountRupees,
    customer: { name: customer.name, email: customer.email, phone: customer.phone },
    itemsText,
    ownerPhone,
    ownerEmail,
  });

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      notified: true,
      whatsapp_url: whatsappUrl,
      payment_id,
      order_id,
    }),
  };
};
