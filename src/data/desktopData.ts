import {
  FileText,
  Globe,
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
  path: string;
  kind: "folder" | "file" | "page";
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
  { id: "CV", label: "CV.pdf", icon: FileText, tone: "red", previewUrl: "/public/ORTIZ_CV.pdf" },
  { id: "archive", label: "Assets.zip", icon: Folder, tone: "violet" },
];

const oldPortfolioWebDevBaseUrl = "https://davidortizjr.github.io/old-portfolio/school/";

const pageEntry = (
  id: string,
  name: string,
  previewUrl: string,
): FinderFile => ({
  id,
  name,
  path: name,
  kind: "page",
  typeLabel: "Website page",
  modified: "Live preview",
  size: "Interactive",
  icon: Globe,
  previewUrl,
});

export const finderFiles: FinderFile[] = [
  pageEntry("a03", "LiftMNL", `${oldPortfolioWebDevBaseUrl}/ADET/A03/index.html`),
  pageEntry("api", "API", `${oldPortfolioWebDevBaseUrl}/webdev/API/index.html`),
  pageEntry("mvc", "MVC", `${oldPortfolioWebDevBaseUrl}/ADET/A02/index.php`),
  pageEntry("parallax", "Parallax", `${oldPortfolioWebDevBaseUrl}/webdev/Parallax/banner.html`),
];
