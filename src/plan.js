const DEFAULT_LIMITS = {
  elevatedPain: 5,
  normalPain: 3
};

function section(title, minutes, exercises) {
  return { title, minutes, exercises };
}

function safetyNote() {
  return 'Stop for sharp pain, locking, giving way, new swelling, dizziness, or pain that is clearly worsening. This is a fitness-support plan, not a diagnosis or replacement for your clinician or physiotherapist.';
}

export function createDailyPlan(checkIn = {}) {
  const pain = Number.isFinite(checkIn.kneePain) ? checkIn.kneePain : 0;
  const redFlag = Boolean(checkIn.locking || checkIn.givingWay || checkIn.newSwelling);

  if (redFlag) {
    return {
      level: 'pause',
      title: 'Pause gym training and arrange clinical advice',
      totalMinutes: 10,
      safety: safetyNote(),
      sections: [section('Gentle movement only', 10, [
        'Easy walking on level ground or gentle ankle pumps only if comfortable.',
        'Do not test the knee with leg press, squats, lunges, twisting, running, or jumping.'
      ])]
    };
  }

  if (pain >= DEFAULT_LIMITS.elevatedPain) {
    return {
      level: 'recovery',
      title: 'Low-load recovery gym session',
      totalMinutes: 45,
      safety: safetyNote(),
      sections: [
        section('Warm-up', 10, ['Stationary bike, easy resistance, high enough seat to avoid deep knee bending.']),
        section('Upper body and knee-friendly movement', 25, [
          'Seated cable row: 2 sets of 8 to 10 comfortable repetitions.',
          'Seated chest press: 2 sets of 8 to 10 comfortable repetitions.',
          'Seated shoulder press or light dumbbell press: 2 sets of 8 repetitions.',
          'Supported calf raises: 2 sets of 8 repetitions.',
          'Finish with 5 minutes very easy cycling only if pain is not increasing.'
        ]),
        section('Cool-down', 10, ['Slow breathing and gentle upper-body stretches. Keep the knee in a comfortable range.'])
      ]
    };
  }

  return {
    level: pain > DEFAULT_LIMITS.normalPain ? 'reduced' : 'strength',
    title: pain > DEFAULT_LIMITS.normalPain ? 'Reduced-load strength gym session' : 'Knee-conscious full-body strength gym session',
    totalMinutes: 55,
    safety: safetyNote(),
    sections: [
      section('Warm-up', 10, [
        'Stationary bike: 7 minutes at easy conversational effort; use a high seat and no deep knee bend.',
        'Ankle circles, gentle seated knee straightening, shoulder rolls: 3 minutes total.'
      ]),
      section('Main strength work', 35, [
        'Leg press: 2 sets of 8 repetitions using only the depth and load already cleared by your clinician. Keep knees aligned with toes; do not lock the knees.',
        'Seated hamstring curl: 2 sets of 8 repetitions at a light, smooth resistance.',
        'Seated cable row: 2 sets of 8 to 10 repetitions.',
        'Machine chest press or dumbbell chest press: 2 sets of 8 to 10 repetitions.',
        'Cable pull-through or glute bridge: 2 sets of 8 repetitions, only if pain-free and your balance feels secure.',
        'Supported calf raise: 2 sets of 8 repetitions.',
        'Rest 60 to 90 seconds between sets. Choose a load that leaves about 3 comfortable repetitions in reserve.'
      ]),
      section('Cool-down and stretching', 10, [
        'Easy cycling or walking: 3 minutes.',
        'Gentle calf, hamstring, chest and hip stretches: 20 to 30 seconds each, without forcing the knee bend.',
        'Slow breathing: 2 minutes.'
      ])
    ]
  };
}

export function renderPlan(plan) {
  return [
    `Good morning. ${plan.title} (${plan.totalMinutes} minutes)`,
    ...plan.sections.flatMap((current) => [
      `\n${current.title} — ${current.minutes} min`,
      ...current.exercises.map((exercise) => `• ${exercise}`)
    ]),
    `\nSafety: ${plan.safety}`
  ].join('\n');
}
