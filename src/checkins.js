import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function readLatestCheckIn(filePath) {
  try {
    const entries = JSON.parse(await readFile(filePath, 'utf8'));
    return entries.at(-1) || {};
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

export async function saveCheckIn(filePath, checkIn) {
  if (!Number.isInteger(checkIn.kneePain) || checkIn.kneePain < 0 || checkIn.kneePain > 10) {
    throw new Error('kneePain must be an integer from 0 to 10.');
  }
  await mkdir(dirname(filePath), { recursive: true });
  const latest = await readLatestCheckIn(filePath);
  const entries = latest.createdAt ? JSON.parse(await readFile(filePath, 'utf8')) : [];
  const saved = {
    createdAt: new Date().toISOString(),
    kneePain: checkIn.kneePain,
    newSwelling: Boolean(checkIn.newSwelling),
    locking: Boolean(checkIn.locking),
    givingWay: Boolean(checkIn.givingWay),
    energy: checkIn.energy || 'not-recorded'
  };
  entries.push(saved);
  await writeFile(filePath, `${JSON.stringify(entries, null, 2)}\n`);
  return saved;
}
