import { Cloud, Clock3, FolderOpen, LayoutGrid, List, Search, Users } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

import { finderFiles } from "../../data/desktopData";
import { FINDER_VIEW_MODE_STORAGE_KEY } from "../../constants/formatting";
import { useDraggableWindow } from "../../hooks/useDraggableWindow";

type FinderSidebarSection = "all" | "projects" | "shared" | "icloud";

type ViewerFile = {
  id: string;
  title: string;
  src: string;
  description: string;
};

type FinderWindowProps = {
  isOpen: boolean;
  origin?: { left: number; top: number; width: number; height: number } | null;
  onClose?: () => void;
  onMinimize?: () => void;
  onClosed?: () => void;
  onOpenFile?: (file: ViewerFile) => void;
};

const FinderWindow = ({ isOpen, origin, onClose, onMinimize, onClosed, onOpenFile }: FinderWindowProps) => {
  const finderRef = useRef<HTMLElement>(null);
  const snapPulseTimerRef = useRef<number | null>(null);
  const originRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const restorePositionRef = useRef<{ x: number; y: number } | null>(null);
  const hasOpenedOnceRef = useRef(false);
  const wasClampedRef = useRef(false);
  const handleClampChange = useCallback((isClamped: boolean, shell: HTMLDivElement) => {
    if (!isClamped) {
      wasClampedRef.current = false;
      return;
    }

    if (!wasClampedRef.current) {
      shell.classList.add("snap-bounce");

      if (snapPulseTimerRef.current) {
        window.clearTimeout(snapPulseTimerRef.current);
      }

      snapPulseTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("snap-bounce");
        snapPulseTimerRef.current = null;
      }, 180);
    }

    wasClampedRef.current = true;
  }, []);
  const { shellRef, shellPosition, setShellPosition, handleWindowPointerDown } = useDraggableWindow({
    isOpen,
    blockDragSelector: "button",
    topBarHeight: 44,
    onClampChange: handleClampChange,
  });
  const [viewMode, setViewMode] = useState<"details" | "icons">(() => {
    if (typeof window === "undefined") {
      return "details";
    }

    const storedViewMode = window.localStorage.getItem(FINDER_VIEW_MODE_STORAGE_KEY);

    return storedViewMode === "icons" ? "icons" : "details";
  });
  const [sidebarSection, setSidebarSection] = useState<FinderSidebarSection>("all");

  const visibleFiles = (() => {
    switch (sidebarSection) {
      case "shared":
        return [...finderFiles].slice().reverse();
      case "projects":
        return finderFiles.filter((file) => file.kind === "page");
      case "icloud":
        return finderFiles.filter((file) => file.kind === "page");
      default:
        return finderFiles;
    }
  })();

  useEffect(() => {
    window.localStorage.setItem(FINDER_VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);
  useEffect(() => {
    if (origin) {
      originRef.current = origin;
    }
  }, [origin]);

  const handleOpenFile = (fileId: string) => {
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

  const handleMinimize = () => {
    setIsZoomed(false);
    onMinimize?.();
  };

  const handleZoomToggle = () => {
    setIsZoomed((current) => {
      const next = !current;
      const viewportCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      if (next) {
        restorePositionRef.current = shellPosition;
        setShellPosition(viewportCenter);
      } else if (restorePositionRef.current) {
        setShellPosition(restorePositionRef.current);
      }

      return next;
    });
  };

  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    return () => {
      if (snapPulseTimerRef.current) {
        window.clearTimeout(snapPulseTimerRef.current);
        snapPulseTimerRef.current = null;
      }
    };
  }, []);

  useGSAP(
    () => {
      const finder = finderRef.current;
      if (!finder) {
        return;
      }

      const items = finder.querySelectorAll<HTMLElement>(".finder-window-item");
      const finderRect = finder.getBoundingClientRect();

      // Fallback to approximate dock position (bottom center)
      const fallbackOrigin = originRef.current || {
        left: window.innerWidth / 2,
        top: window.innerHeight - 80,
        width: 72,
        height: 72,
      };

      const sourceCenterX = fallbackOrigin.left + fallbackOrigin.width / 2;
      const sourceCenterY = fallbackOrigin.top + fallbackOrigin.height / 2;
      const finderCenterX = finderRect.left + finderRect.width / 2;
      const finderCenterY = finderRect.top + finderRect.height / 2;
      const fromX = sourceCenterX - finderCenterX;
      const fromY = sourceCenterY - finderCenterY;
      const fromScaleRaw = fallbackOrigin.width / finderRect.width;
      const fromScale = Math.min(Math.max(fromScaleRaw, 0.08), 0.32);
      gsap.set(finder, { transformOrigin: "50% 100%", transformPerspective: 900, force3D: true });

      if (isOpen) {
        hasOpenedOnceRef.current = true;
        gsap.killTweensOf([finder, ...items]);
        gsap.fromTo(
          finder,
          {
            x: fromX,
            y: fromY,
            scaleX: fromScale * 0.82,
            scaleY: fromScale * 1.08,
            skewX: 30,
            skewY: 30,
            opacity: 0.25,
            filter: "blur(6px)",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.42,
            ease: "expo.out",
          }
        );

        gsap.fromTo(
          items,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.3,
            delay: 0.04,
            ease: "power2.out",
          }
        );
        return;
      }

      if (!hasOpenedOnceRef.current) {
        gsap.killTweensOf([finder, ...items]);
        gsap.set(finder, {
          x: fromX,
          y: fromY,
          scaleX: fromScale * 0.76,
          scaleY: fromScale * 1.1,
          skewX: 30,
          skewY: 30,
          opacity: 0,
          filter: "blur(6px)",
        });
        return;
      }

      gsap.killTweensOf([finder, ...items]);
      gsap.to(finder, {
        x: fromX,
        y: fromY,
        scaleX: fromScale * 0.76,
        scaleY: fromScale * 1.1,
        skewX: 30,
        skewY: 30,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.26,
        ease: "power2.in",
        onComplete: onClosed,
      });
    },
    { scope: finderRef, dependencies: [isOpen, origin, onClosed] }
  );

  useGSAP(
    () => {
      if (!isOpen) {
        return;
      }

      const finder = finderRef.current;
      if (!finder) {
        return;
      }

      const items = finder.querySelectorAll<HTMLElement>(".finder-window-item");

      gsap.killTweensOf(items);
      gsap.fromTo(
        items,
        { opacity: 0, y: 8, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.03,
          duration: 0.2,
          ease: "power1.out",
        }
      );
    },
    { scope: finderRef, dependencies: [viewMode, isOpen] }
  );

  return (
    <div
      className={`finder-shell${isOpen ? " is-open" : " is-closing"}${isZoomed ? " is-zoomed" : ""}`}
      ref={shellRef}
      style={{ transform: `translate3d(${shellPosition.x}px, ${shellPosition.y}px, 0) translate(-50%, -50%)` }}
      aria-label="Web Pages Finder window"
    >
      <section className="finder-window" ref={finderRef}>
        <div className="finder-sidebar">
          <div className="traffic-lights" role="group" aria-label="Finder window controls">
            <button type="button" className="traffic traffic-button red" onClick={onClose} aria-label="Close Finder">
              <span className="traffic-symbol" aria-hidden="true">×</span>
            </button>
            <button type="button" className="traffic traffic-button yellow" onClick={handleMinimize} aria-label="Minimize Finder">
              <span className="traffic-symbol" aria-hidden="true">−</span>
            </button>
            <button type="button" className="traffic traffic-button green" onClick={handleZoomToggle} aria-label={isZoomed ? "Restore Finder size" : "Zoom Finder"}>
              <span className="traffic-symbol" aria-hidden="true">+</span>
            </button>
          </div>

          <h3 className="sidebar-section-label">Favorites</h3>
          <nav className="sidebar-list" aria-label="Finder favorites">
            <button type="button" className={`sidebar-item${sidebarSection === "all" ? " active" : ""}`} onClick={() => setSidebarSection("all")}>
              <span className={`sidebar-icon-wrap${sidebarSection === "all" ? " active" : ""}`}>
                <FolderOpen size={14} />
              </span>
              All Pages
            </button>
            <button type="button" className={`sidebar-item${sidebarSection === "shared" ? " active" : ""}`} onClick={() => setSidebarSection("shared")}>
              <span className={`sidebar-icon-wrap${sidebarSection === "shared" ? " active" : ""}`}>
                <Users size={14} />
              </span>
              Recent
            </button>
            <button type="button" className={`sidebar-item${sidebarSection === "projects" ? " active" : ""}`} onClick={() => setSidebarSection("projects")}>
              <span className={`sidebar-icon-wrap${sidebarSection === "projects" ? " active" : ""}`}>
                <Clock3 size={14} />
              </span>
              Websites
            </button>
            <button type="button" className={`sidebar-item${sidebarSection === "icloud" ? " active" : ""}`} onClick={() => setSidebarSection("icloud")}>
              <span className={`sidebar-icon-wrap${sidebarSection === "icloud" ? " active" : ""}`}>
                <Cloud size={14} />
              </span>
              Live
            </button>
          </nav>

          <h3 className="sidebar-section-label">Tags</h3>
          <div className="tag-list">
            <span className="tag-item">
              <i className="tag-dot red" /> Static
            </span>
            <span className="tag-item">
              <i className="tag-dot orange" /> Frontend
            </span>
            <span className="tag-item">
              <i className="tag-dot blue" /> Live Preview
            </span>
          </div>
        </div>

        <div className="finder-content">
          <header className="finder-header">
            <div className="finder-drag-area" onPointerDown={handleWindowPointerDown} aria-hidden="true" />
            <div>
              <h1>Web Pages</h1>
              <p>Live previews for the published portfolio sites</p>
            </div>
            <div className="finder-header-actions">
              <button type="button" className="header-icon-btn" aria-label="Search pages">
                <Search size={16} />
              </button>
              <button
                type="button"
                className="header-icon-btn"
                aria-label={viewMode === "details" ? "Switch to icon view" : "Switch to list view"}
                onClick={() => setViewMode((mode) => (mode === "details" ? "icons" : "details"))}
              >
                {viewMode === "details" ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
            </div>
          </header>

          <div className={`project-grid finder-grid finder-grid--${viewMode}`}>
            {viewMode === "details" ? (
              <>
                <div className="finder-file-header finder-window-item" role="row">
                  <span>Name</span>
                  <span>Kind</span>
                  <span>Date Modified</span>
                  <span>Size</span>
                </div>

                {visibleFiles.map((file) => {
                  const Icon = file.icon;
                  const canOpen = Boolean(file.previewUrl && onOpenFile);

                  return (
                    <button
                      key={file.id}
                      type="button"
                      className={`finder-file-row finder-window-item${canOpen ? " is-clickable" : ""}`}
                      onClick={() => handleOpenFile(file.id)}
                      disabled={!canOpen}
                    >
                      <span className="finder-file-name">
                        <span className="finder-file-name-main">
                          <span className={`finder-file-icon-wrap ${file.kind}`}>
                            <Icon size={14} className={`finder-file-icon ${file.kind}`} />
                          </span>
                          <span className="finder-file-name-copy">{file.name}</span>
                        </span>
                        <span className="finder-file-path">{file.path}</span>
                      </span>
                      <span>{file.typeLabel}</span>
                      <span>{file.modified}</span>
                      <span>{file.size}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              visibleFiles.map((file) => {
                const Icon = file.icon;
                const canOpen = Boolean(file.previewUrl && onOpenFile);

                return (
                  <button
                    key={file.id}
                    type="button"
                    className={`finder-icon-item finder-window-item${canOpen ? " is-clickable" : ""}`}
                    onClick={() => handleOpenFile(file.id)}
                    disabled={!canOpen}
                  >
                    <span className="finder-icon-tile">
                      <span className={`finder-icon-glyph-wrap ${file.kind}`}>
                        <Icon size={22} className={`finder-file-icon ${file.kind}`} />
                      </span>
                    </span>
                    <span className="finder-icon-name">{file.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinderWindow;
