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
  previewUrl?: string;
};

export type FinderFile = {
  id: string;
  name: string;
  kind: "folder" | "file";
  typeLabel: string;
  modified: string;
  size: string;
  icon: LucideIcon;
  previewUrl?: string;
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
  { id: "CV", label: "CV.pdf", icon: FileText, tone: "red", previewUrl: "/Ortiz_CV.pdf" },
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
    icon: Folder
  },
  {
    id: "GabayIsko",
    name: "GabayIsko",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Today, 9:18 AM",
    size: "4.8 MB",
    icon: FileText
  },
  {
    id: "TasteBuds",
    name: "TasteBuds",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Yesterday, 6:03 PM",
    size: "11.2 MB",
    icon: FileText
  },
  {
    id: "Valorant-API",
    name: "Valorant API",
    kind: "file",
    typeLabel: "ZIP Archive",
    modified: "Mar 29, 3:47 PM",
    size: "186 MB",
    icon: FileText
  },
  {
    id: "spiderman",
    name: "SPIDER-MAN: ACROSS THE SPIDER-VERSE",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Today, 11:20 AM",
    size: "7.5 MB",
    icon: FileText
  },
  {
    id: "Lift-MNL",
    name: "Lift MNL",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Today, 11:20 AM",
    size: "7.5 MB",
    icon: FileText
  },
  {
    id: "MVC-Framework",
    name: "MVC Framework",
    kind: "file",
    typeLabel: "Sketch Document",
    modified: "Today, 11:20 AM",
    size: "7.5 MB",
    icon: FileText
  }
];
