export const DEFAULT_SPORTS_PAGE = {
  title: 'Sports',
  description: 'A growing sports programme that builds fitness, teamwork, discipline, confidence, and healthy competition across the campus.',
  items: [
    {
      title: 'Football',
      description: 'Team training, match practice, stamina building, and tactical play for students who love the game.',
      imageUrl: ''
    },
    {
      title: 'Basketball',
      description: 'Court-based skill development with focus on agility, coordination, passing, shooting, and teamwork.',
      imageUrl: ''
    },
    {
      title: 'Volleyball',
      description: 'Structured practice for serving, setting, defending, and building quick team communication.',
      imageUrl: ''
    },
    {
      title: 'Horse Riding',
      description: 'Confidence-building riding exposure that supports balance, posture, focus, and responsible care.',
      imageUrl: ''
    }
  ]
};

export const DEFAULT_ACADEMIC_SECTIONS = [
  {
    title: 'Sprouts',
    description: 'A joyful early learning environment focused on play, language, movement, social confidence, and foundational habits.',
    imageUrl: ''
  },
  {
    title: 'LP Section',
    description: 'Lower primary learning that builds literacy, numeracy, expression, curiosity, and classroom confidence.',
    imageUrl: ''
  },
  {
    title: 'Primary Section',
    description: 'Strong foundations through activity-led learning, reading, environmental awareness, communication, and creativity.',
    imageUrl: ''
  },
  {
    title: 'Middle Section',
    description: 'Concept clarity, analytical thinking, guided exploration, collaborative work, and responsible study habits.',
    imageUrl: ''
  },
  {
    title: 'Secondary Section',
    description: 'Focused academic progression with lab exposure, projects, skill development, and board-readiness foundations.',
    imageUrl: ''
  },
  {
    title: 'Senior Secondary Section',
    description: 'Subject specialization, practical learning, mentoring, projects, and focused preparation for higher studies.',
    imageUrl: ''
  }
];

export function mergeListWithDefaults(savedItems, defaultItems) {
  const saved = Array.isArray(savedItems) ? savedItems : [];
  return defaultItems.map((item, index) => ({
    ...item,
    ...(saved[index] || {})
  }));
}
