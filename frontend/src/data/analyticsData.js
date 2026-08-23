export const skills = [
  { skill: "Technical", value: 82 },
  { skill: "Projects", value: 85 },
  { skill: "HR", value: 79 },
  { skill: "Communication", value: 74 },
  { skill: "DSA", value: 68 },
];

export const trend = [48, 54, 51, 59, 67, 64, 72, 76, 74, 82, 80, 88].map(
  (score, index) => ({ session: index + 1, score }),
);

export const recentInterviews = [
  { date: "20 May 2024", category: "Technical", score: "78%", duration: "45 min", improvement: "↑ 8%", tone: "blue" },
  { date: "18 May 2024", category: "System Design", score: "70%", duration: "60 min", improvement: "↑ 5%", tone: "purple" },
  { date: "15 May 2024", category: "Behavioral", score: "85%", duration: "30 min", improvement: "-", tone: "green" },
];
