import { Cloud, Clock3, FolderOpen, LayoutGrid, List, Search, Users } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { finderFiles } from "../data/desktopData";

const FINDER_VIEW_MODE_STORAGE_KEY = "mac-portfolio-finder-view-mode";

type FinderWindowProps = {
  isOpen: boolean;
  origin?: { left: number; top: number; width: number; height: number } | null;
  onClose?: () => void;
  onClosed?: () => void;
};

const FinderWindow = ({ isOpen, origin, onClose, onClosed }: FinderWindowProps) => {
  const finderRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const snapPulseTimerRef = useRef<number | null>(null);
  const wasClampedRef = useRef(false);
  const dragStateRef = useRef<{
    isDragging: boolean;
    offsetX: number;
    offsetY: number;
  }>({ isDragging: false, offsetX: 0, offsetY: 0 });
  const [viewMode, setViewMode] = useState<"details" | "icons">(() => {
    if (typeof window === "undefined") {
      return "details";
    }

    const storedViewMode = window.localStorage.getItem(FINDER_VIEW_MODE_STORAGE_KEY);

    return storedViewMode === "icons" ? "icons" : "details";
  });

  useEffect(() => {
    window.localStorage.setItem(FINDER_VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  const [shellPosition, setShellPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 0, y: 0 };
    }

    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const clamp = (value: number, min: number, max: number) => {
      return Math.min(Math.max(value, min), max);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState.isDragging) {
        return;
      }

      const shell = shellRef.current;
      if (!shell) {
        return;
      }

      const shellWidth = shell.offsetWidth;
      const shellHeight = shell.offsetHeight;
      const minX = shellWidth / 2;
      const maxX = window.innerWidth - shellWidth / 2;
      const minY = shellHeight / 2;
      const maxY = window.innerHeight - shellHeight / 2;
      const rawX = event.clientX - dragState.offsetX;
      const rawY = event.clientY - dragState.offsetY;
      const nextX = clamp(rawX, minX, maxX);
      const nextY = clamp(rawY, minY, maxY);
      const isClamped = nextX !== rawX || nextY !== rawY;

      setShellPosition({ x: nextX, y: nextY });

      if (isClamped && !wasClampedRef.current) {
        shell.classList.add("snap-bounce");

        if (snapPulseTimerRef.current) {
          window.clearTimeout(snapPulseTimerRef.current);
        }

        snapPulseTimerRef.current = window.setTimeout(() => {
          shell.classList.remove("snap-bounce");
          snapPulseTimerRef.current = null;
        }, 180);
      }

      wasClampedRef.current = isClamped;
    };

    const handlePointerUp = () => {
      dragStateRef.current.isDragging = false;
      const shell = shellRef.current;
      if (shell) {
        shell.classList.remove("is-dragging");
      }
      wasClampedRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (snapPulseTimerRef.current) {
        window.clearTimeout(snapPulseTimerRef.current);
        snapPulseTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleWindowPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    const windowElement = event.currentTarget;
    const windowRect = windowElement.getBoundingClientRect();
    const isInTopBar = event.clientY - windowRect.top <= 44;

    if (!isInTopBar) {
      return;
    }

    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    dragStateRef.current.isDragging = true;
    dragStateRef.current.offsetX = event.clientX - shellPosition.x;
    dragStateRef.current.offsetY = event.clientY - shellPosition.y;
    shell.classList.add("is-dragging");
    windowElement.setPointerCapture(event.pointerId);
  };

  useGSAP(
    () => {
      const finder = finderRef.current;
      if (!finder) {
        return;
      }

      const items = finder.querySelectorAll<HTMLElement>(".finder-window-item");
      const finderRect = finder.getBoundingClientRect();

      const fallbackOrigin = {
        left: finderRect.left + finderRect.width / 2,
        top: finderRect.top + finderRect.height,
        width: 72,
        height: 72,
      };

      const source = origin ?? fallbackOrigin;
      const sourceCenterX = source.left + source.width / 2;
      const sourceCenterY = source.top + source.height / 2;
      const finderCenterX = finderRect.left + finderRect.width / 2;
      const finderCenterY = finderRect.top + finderRect.height / 2;
      const fromX = sourceCenterX - finderCenterX;
      const fromY = sourceCenterY - finderCenterY;
      const fromScaleRaw = source.width / finderRect.width;
      const fromScale = Math.min(Math.max(fromScaleRaw, 0.08), 0.32);
      gsap.set(finder, { transformOrigin: "50% 100%", transformPerspective: 900, force3D: true });

      if (isOpen) {
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
            ease: "power3.out",
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
      className={`finder-shell${isOpen ? " is-open" : " is-closing"}`}
      ref={shellRef}
      style={{ left: `${shellPosition.x}px`, top: `${shellPosition.y}px` }}
      aria-label="Projects Finder window"
    >
      <section className="finder-window" ref={finderRef}>
        <div className="finder-sidebar">
          <div className="traffic-lights" aria-hidden="true">
            <button type="button" className="traffic red" onClick={onClose} aria-label="Close Finder" />
            <span className="traffic yellow" />
            <span className="traffic green" />
          </div>

          <h3 className="sidebar-section-label">Favorites</h3>
          <nav className="sidebar-list" aria-label="Finder favorites">
            <button type="button" className="sidebar-item active">
              <span className="sidebar-icon-wrap active">
                <FolderOpen size={14} />
              </span>
              All Files
            </button>
            <button type="button" className="sidebar-item">
              <span className="sidebar-icon-wrap">
                <Clock3 size={14} />
              </span>
              Recent
            </button>
            <button type="button" className="sidebar-item">
              <span className="sidebar-icon-wrap">
                <Users size={14} />
              </span>
              Shared
            </button>
            <button type="button" className="sidebar-item">
              <span className="sidebar-icon-wrap">
                <Cloud size={14} />
              </span>
              iCloud Drive
            </button>
          </nav>

          <h3 className="sidebar-section-label">Tags</h3>
          <div className="tag-list">
            <span className="tag-item">
              <i className="tag-dot red" /> Red
            </span>
            <span className="tag-item">
              <i className="tag-dot orange" /> Work
            </span>
            <span className="tag-item">
              <i className="tag-dot blue" /> Personal
            </span>
          </div>
        </div>

        <div className="finder-content">
          <header className="finder-header">
            <div className="finder-drag-area" onPointerDown={handleWindowPointerDown} aria-hidden="true" />
            <div>
              <h1>Projects</h1>
              <p>Creative works and case studies</p>
            </div>
            <div className="finder-header-actions">
              <button type="button" className="header-icon-btn" aria-label="Search projects">
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
                  <span>Type</span>
                  <span>Date Modified</span>
                  <span>Size</span>
                </div>

                {finderFiles.map((file) => {
                  const Icon = file.icon;

                  return (
                    <button key={file.id} type="button" className="finder-file-row finder-window-item">
                      <span className="finder-file-name">
                        <span className={`finder-file-icon-wrap ${file.kind}`}>
                          <Icon size={14} className={`finder-file-icon ${file.kind}`} />
                        </span>
                        {file.name}
                      </span>
                      <span>{file.typeLabel}</span>
                      <span>{file.modified}</span>
                      <span>{file.size}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              finderFiles.map((file) => {
                const Icon = file.icon;

                return (
                  <button key={file.id} type="button" className="finder-icon-item finder-window-item">
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
