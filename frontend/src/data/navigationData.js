import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  BrainCircuit,
  BarChart3,
  History,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  { icon: LayoutDashboard, text: "Dashboard", to: "/dashboard" },
  { icon: PlayCircle, text: "Start Interview", to: "/interview/setup" },
  { icon: FileText, text: "Resume", to: "/resume" },
  { icon: BrainCircuit, text: "AI Coach", to: "/coach" },
  { icon: BarChart3, text: "Analytics", to: "/analytics" },
  { icon: History, text: "History", to: "/history" },
  { icon: Settings, text: "Settings", to: "/settings" },
];

export const navbarLinks = [
  "Features",
  "How It Works",
  "AI Interview",
  "Analytics",
  "Pricing",
];
