import { Code2, Braces, Network, Boxes, Cpu, Database } from "lucide-react";

export const strengths = [
  { name: "React Framework", value: 92, icon: Code2 },
  { name: "JavaScript Fundamentals", value: 84, icon: Braces },
  { name: "Project Architecture", value: 87, icon: Network },
];

export const improvement = [
  { name: "Data Structures & Algos", value: 61, icon: Boxes },
  { name: "System Design", value: 54, icon: Cpu },
  { name: "Database Optimization", value: 68, icon: Database },
];

export const mockScores = [51, 57, 49, 64, 72, 66, 78, 74, 82, 76, 84, 92].map(
  (score, index) => ({ session: index + 1, score }),
);
