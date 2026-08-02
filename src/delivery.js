export async function deliverPlan(message, environment = process.env) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, WHATSAPP_TO, TWILIO_CONTENT_SID } = environment;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !WHATSAPP_TO || !TWILIO_CONTENT_SID) {
    console.log(message);
    return { mode: 'console', sent: false };
  }

  const body = new URLSearchParams({
    To: `whatsapp:${WHATSAPP_TO}`,
    From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    ContentSid: TWILIO_CONTENT_SID,
    ContentVariables: JSON.stringify({ 1: message })
  });
  const authorization = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${authorization}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!response.ok) throw new Error(`WhatsApp delivery failed: ${response.status} ${await response.text()}`);
  return { mode: 'whatsapp', sent: true, response: await response.json() };
}
