import {
  FileText,
  Folder,
  FolderOpen,
  MessageCircle,
  Trash2,
  User,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type DockApp = {
  id: string;
  name: string;
  icon: LucideIcon;
  canOpen: boolean;
  accent?: string;
};

export type DesktopShortcut = {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: "blue" | "red" | "violet";
};

export type FinderFile = {
  id: string;
  name: string;
  kind: "folder" | "file";
  typeLabel: string;
  modified: string;
  size: string;
  icon: LucideIcon;
};

export const menuItems = ["File", "Edit", "View", "Go", "Window", "Help"];

export const dockApps: DockApp[] = [
  { id: "projects", name: "Projects", icon: FolderOpen, canOpen: true, accent: "#4f86ff" },
  { id: "about", name: "About Me", icon: User, canOpen: true, accent: "#62c3ff" },
  { id: "contact", name: "Contact", icon: MessageCircle, canOpen: true, accent: "#7bc17b" },
  { id: "trash", name: "Trash", icon: Trash2, canOpen: true, accent: "#b3b8c3" },
];

export const desktopIcons: DesktopShortcut[] = [
  { id: "portfolio", label: "Portfolio_v2", icon: Folder, tone: "blue" },
  { id: "resume", label: "Resume.pdf", icon: FileText, tone: "red" },
  { id: "archive", label: "Assets.zip", icon: Folder, tone: "violet" },
];

export const finderFiles: FinderFile[] = [
  {
    id: "case-studies",
    name: "Case Studies",
    kind: "folder",
    typeLabel: "Folder",
    modified: "Today, 10:42 AM",
    size: "--",
    icon: Folder,
  },
  {
    id: "fintech-dashboard",
    name: "FinTech Dashboard.fig",
    kind: "file",
    typeLabel: "Figma File",
    modified: "Today, 9:18 AM",
    size: "4.8 MB",
    icon: FileText,
  },
  {
    id: "luxe-mobile",
    name: "Luxe Mobile App.sketch",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Yesterday, 6:03 PM",
    size: "11.2 MB",
    icon: FileText,
  },
  {
    id: "ecobrand-assets",
    name: "EcoBrand_Assets.zip",
    kind: "file",
    typeLabel: "ZIP Archive",
    modified: "Mar 29, 3:47 PM",
    size: "186 MB",
    icon: FileText,
  },
  {
    id: "resume",
    name: "Resume_2026.pdf",
    kind: "file",
    typeLabel: "PDF Document",
    modified: "Mar 26, 11:20 AM",
    size: "920 KB",
    icon: FileText,
  },
  {
    id: "readme",
    name: "README.txt",
    kind: "file",
    typeLabel: "Text Document",
    modified: "Mar 21, 8:09 AM",
    size: "2 KB",
    icon: FileText,
  },
];
