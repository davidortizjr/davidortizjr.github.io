import { useRef } from "react";
import type { CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Globe, Mail } from "lucide-react";

import { dockApps } from "../data/desktopData";

type DockProps = {
  activeAppId: string | null;
  onToggleApp: (
    appId: string,
    origin?: { left: number; top: number; width: number; height: number }
  ) => void;
};

const Dock = ({ activeAppId, onToggleApp }: DockProps) => {
  const dockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) {
      return;
    }

    const icons = dock.querySelectorAll<HTMLElement>(".dock-item");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const direction = mouseX >= center ? -1 : 1;
        const radius = 120;

        if (distance >= radius) {
          gsap.to(icon, {
            scale: 1,
            y: 0,
            x: 0,
            duration: 0.2,
            ease: "power1.out",
          });
          return;
        }

        const normalized = distance / radius;
        const intensity = Math.exp(-((normalized * radius) ** 2.5) / 6200);

        gsap.to(icon, {
          scale: 1 + 0.42 * intensity,
          y: -16 * intensity,
          x: direction * 6 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(event.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          x: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
      resetIcons();
    };
  });

  return (
    <footer className="dock-wrapper">
      <div className="dock" ref={dockRef}>
        {dockApps.map(({ id, name, icon: Icon, canOpen, accent }) => {
          return (
            <div key={id}>
              <button
                type="button"
                className={`dock-item${activeAppId === id ? " active" : ""}`}
                aria-label={name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={name}
                disabled={!canOpen}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  onToggleApp(id, {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                  });
                }}
              >
                <span className={`dock-icon-surface dock-icon-surface-${id}`} style={{ "--icon-accent": accent } as CSSProperties}>
                  <Icon size={24} strokeWidth={2.2} className="dock-icon-glyph" />
                </span>
                <span className="dock-tooltip">{name}</span>
                {activeAppId === id ? <i className="dock-running-dot" aria-hidden="true" /> : null}
              </button>
            </div>
          );
        })}
        <span className="dock-divider" aria-hidden="true" />
        <a className="dock-item social" href="https://github.com" target="_blank" rel="noreferrer">
          <span className="dock-icon-surface dock-icon-surface-github">
            <Globe size={21} strokeWidth={2.1} className="dock-icon-glyph" />
          </span>
          <span className="dock-tooltip">GitHub</span>
        </a>
        <a className="dock-item social" href="https://linkedin.com" target="_blank" rel="noreferrer">
          <span className="dock-icon-surface dock-icon-surface-linkedin">
            <Mail size={20} strokeWidth={2.2} className="dock-icon-glyph" />
          </span>
          <span className="dock-tooltip">LinkedIn</span>
        </a>
      </div>
    </footer>
  );
};

export default Dock;
