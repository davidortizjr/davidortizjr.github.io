import { useMemo, useState } from "react";
import {
    ArrowLeft,
    FileText,
    FolderOpen,
    Grid2x2,
    Mail,
    MessageCircle,
    Phone,
    Play,
    Trash2,
    User,
    Zap,
} from "lucide-react";

import { finderFiles } from "../data/desktopData";

type ViewerFile = {
    id: string;
    title: string;
    src: string;
    description: string;
};

type MobileIphoneShellProps = {
    clock: string;
    onOpenFile?: (file: ViewerFile) => void;
};

type MobileAppId = "projects" | "about" | "contact" | "resume" | "files" | "trash";

type MobileApp = {
    id: MobileAppId;
    label: string;
    icon: typeof FolderOpen;
    accent: string;
};

const apps: MobileApp[] = [
    { id: "projects", label: "Projects", icon: FolderOpen, accent: "#4f86ff" },
    { id: "about", label: "About Me", icon: User, accent: "#62c3ff" },
    { id: "contact", label: "Contact", icon: MessageCircle, accent: "#7bc17b" },
    { id: "resume", label: "Resume", icon: FileText, accent: "#e07a5f" },
    { id: "files", label: "Files", icon: Grid2x2, accent: "#b792ff" },
    { id: "trash", label: "Trash", icon: Trash2, accent: "#b3b8c3" },
];

const dockApps = apps.slice(0, 4);

const MobileIphoneShell = ({ clock, onOpenFile }: MobileIphoneShellProps) => {
    const [activeApp, setActiveApp] = useState<MobileAppId | null>(null);

    const activeAppMeta = useMemo(() => {
        return apps.find((app) => app.id === activeApp) ?? null;
    }, [activeApp]);

    const openApp = (appId: MobileAppId) => {
        setActiveApp(appId);
    };

    const closeApp = () => {
        setActiveApp(null);
    };

    const openPdf = (fileId: string) => {
        const file = finderFiles.find((entry) => entry.id === fileId);
        if (!file?.previewUrl || !onOpenFile) {
            return;
        }

        onOpenFile({
            id: file.id,
            title: file.name,
            src: file.previewUrl,
            description: file.typeLabel,
        });
    };

    return (
        <div className="iphone-app">
            <div className="iphone-wallpaper" aria-hidden="true" />
            <div className="iphone-shell">
                <div className="iphone-device">
                    <div className="iphone-notch" aria-hidden="true">
                        <span className="iphone-camera" />
                        <span className="iphone-speaker" />
                    </div>

                    <header className="iphone-status-bar">
                        <span className="iphone-status-time">{clock}</span>
                        <div className="iphone-status-icons" aria-hidden="true">
                            <span className="iphone-signal" />
                            <span className="iphone-wifi" />
                            <span className="iphone-battery">84%</span>
                        </div>
                    </header>

                    <main className={`iphone-home${activeApp ? " is-dimmed" : ""}`}>
                        <section className="iphone-hero">
                            <p className="iphone-kicker">Portfolio</p>
                            <h1>David Ortiz</h1>
                            <p className="iphone-description">
                                Full stack developer, UI thinker, and builder of polished digital experiences.
                            </p>
                        </section>

                        <section className="iphone-app-grid" aria-label="iPhone apps">
                            {apps.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <button
                                        key={app.id}
                                        type="button"
                                        className="iphone-app-icon"
                                        onClick={() => openApp(app.id)}
                                        style={{ ["--app-accent" as never]: app.accent }}
                                    >
                                        <span className="iphone-app-icon-surface">
                                            <Icon size={26} strokeWidth={2.1} />
                                        </span>
                                        <span className="iphone-app-label">{app.label}</span>
                                    </button>
                                );
                            })}
                        </section>

                        <footer className="iphone-dock" aria-label="Phone dock">
                            {dockApps.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <button
                                        key={app.id}
                                        type="button"
                                        className={`iphone-dock-icon${activeApp === app.id ? " is-active" : ""}`}
                                        onClick={() => openApp(app.id)}
                                        aria-label={app.label}
                                    >
                                        <span className="iphone-dock-icon-surface" style={{ ["--app-accent" as never]: app.accent }}>
                                            <Icon size={24} strokeWidth={2.15} />
                                        </span>
                                    </button>
                                );
                            })}
                        </footer>
                    </main>

                    <section className={`iphone-sheet${activeApp ? " is-open" : ""}`} aria-hidden={!activeApp}>
                        <div className="iphone-sheet-glass" />
                        <div className="iphone-sheet-header">
                            <button type="button" className="iphone-sheet-back" onClick={closeApp} aria-label="Close app">
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <p className="iphone-sheet-kicker">Portfolio app</p>
                                <h2>{activeAppMeta?.label ?? "App"}</h2>
                            </div>
                            <button type="button" className="iphone-sheet-action" onClick={closeApp} aria-label="Close app">
                                <Phone size={16} />
                            </button>
                        </div>

                        <div className="iphone-sheet-body">
                            {activeApp === "projects" && (
                                <div className="iphone-card-stack">
                                    {finderFiles.slice(0, 5).map((file) => (
                                        <article key={file.id} className="iphone-card">
                                            <div>
                                                <p className="iphone-card-title">{file.name}</p>
                                                <p className="iphone-card-subtitle">
                                                    {file.typeLabel} · {file.modified}
                                                </p>
                                            </div>
                                            <span className="iphone-card-meta">{file.size}</span>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {activeApp === "about" && (
                                <div className="iphone-about-panel">
                                    <p>
                                        I build responsive React interfaces, clean interactions, and polished product experiences with a
                                        focus on performance and detail.
                                    </p>
                                    <div className="iphone-skill-list">
                                        <span>React</span>
                                        <span>TypeScript</span>
                                        <span>Animation</span>
                                        <span>UI/UX</span>
                                        <span>SEO</span>
                                        <span>Accessibility</span>
                                        <span>Node.js</span>
                                        <span>PHP</span>
                                        <span>Express.js</span>
                                        <span>ASP.NET</span>
                                        <span>Figma</span>
                                        <span>CSS</span>
                                        <span>Tailwind</span>
                                        <span>Bootstrap</span>
                                    </div>
                                </div>
                            )}

                            {activeApp === "contact" && (
                                <div className="iphone-contact-panel">
                                    <a href="mailto:hello@davidortiz.dev" className="iphone-contact-link">
                                        <Mail size={18} /> Email
                                    </a>
                                    <a href="https://github.com/davidortizjr" target="_blank" rel="noreferrer" className="iphone-contact-link">
                                        <Play size={18} /> GitHub
                                    </a>
                                    <a href="https://www.linkedin.com/in/david-ortiz-446012374/" target="_blank" rel="noreferrer" className="iphone-contact-link">
                                        <Zap size={18} /> LinkedIn
                                    </a>
                                </div>
                            )}

                            {activeApp === "resume" && (
                                <div className="iphone-resume-panel">
                                    <p>Résumé ready for mobile viewing.</p>
                                    <button type="button" className="iphone-primary-action" onClick={() => openPdf("resume")}>
                                        View resume PDF
                                    </button>
                                </div>
                            )}

                            {activeApp === "files" && (
                                <div className="iphone-files-panel">
                                    <button type="button" className="iphone-folder-row" onClick={() => openPdf("resume")}>
                                        Resume_2026.pdf
                                    </button>
                                    <button type="button" className="iphone-folder-row" onClick={() => openPdf("readme")}>
                                        README.pdf
                                    </button>
                                    <div className="iphone-folder-row">Assets package</div>
                                </div>
                            )}

                            {activeApp === "trash" && (
                                <div className="iphone-trash-panel">
                                    <Trash2 size={28} />
                                    <p>Nothing to delete right now.</p>
                                </div>
                            )}
                        </div>

                        <button type="button" className="iphone-home-indicator" onClick={closeApp} aria-label="Go home" />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MobileIphoneShell;