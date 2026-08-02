const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function millisecondsUntilSevenIndia(now = new Date()) {
  const indiaNow = new Date(now.getTime() + INDIA_OFFSET_MS);
  let next = Date.UTC(indiaNow.getUTCFullYear(), indiaNow.getUTCMonth(), indiaNow.getUTCDate(), 7) - INDIA_OFFSET_MS;
  if (next <= now.getTime()) next += 24 * 60 * 60 * 1000;
  return next - now.getTime();
}

export function scheduleDailyIndiaSeven(run) {
  const scheduleNext = () => {
    setTimeout(async () => {
      try {
        await run();
      } finally {
        scheduleNext();
      }
    }, millisecondsUntilSevenIndia());
  };
  scheduleNext();
}
