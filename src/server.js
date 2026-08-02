import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { readLatestCheckIn, saveCheckIn } from './checkins.js';
import { deliverPlan } from './delivery.js';
import { createDailyPlan, renderPlan } from './plan.js';
import { scheduleDailyIndiaSeven } from './scheduler.js';

const dataFile = resolve(process.cwd(), 'data/checkins.json');

async function dailyDelivery() {
  const plan = createDailyPlan(await readLatestCheckIn(dataFile));
  return deliverPlan(renderPlan(plan));
}

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return JSON.parse(body || '{}');
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/health') return sendJson(response, 200, { status: 'ok' });
    if (request.method === 'GET' && request.url === '/daily-plan') {
      return sendJson(response, 200, createDailyPlan(await readLatestCheckIn(dataFile)));
    }
    if (request.method === 'POST' && request.url === '/check-ins') {
      return sendJson(response, 201, await saveCheckIn(dataFile, await readJson(request)));
    }
    if (request.method === 'POST' && request.url === '/send-today') return sendJson(response, 200, await dailyDelivery());
    return sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    return sendJson(response, 400, { error: error.message });
  }
});

server.listen(process.env.PORT || 3000, () => console.log('Health workout service listening on port 3000.'));
scheduleDailyIndiaSeven(dailyDelivery);
