import { useRef } from "react";
import { logoGithub, logoLinkedin } from "ionicons/icons";
import { dockApps } from "../data/desktopData";
import DockItem from "./DockItem";
import { useDockHoverAnimation } from "../hooks/useAnimations";

type DockProps = {
  activeAppId: string | null;
  onToggleApp: (
    appId: string,
    origin?: { left: number; top: number; width: number; height: number }
  ) => void;
  onPrefetchApp?: (appId: string) => void;
};

const Dock = ({ activeAppId, onToggleApp, onPrefetchApp }: DockProps) => {
  const dockRef = useRef<HTMLDivElement>(null);

  // Use custom hook for dock hover animation
  useDockHoverAnimation(dockRef);

  return (
    <footer className="dock-wrapper">
      <div className="dock" ref={dockRef}>
        {dockApps.map(({ id, name, icon: Icon, canOpen, accent }) => (
          <DockItem
            key={id}
            id={id}
            name={name}
            Icon={Icon}
            isActive={activeAppId === id}
            canOpen={canOpen}
            accent={accent}
            onToggle={onToggleApp}
            onPrefetch={onPrefetchApp}
          />
        ))}
        <span className="dock-divider" aria-hidden="true" />
        <a
          className="dock-item social"
          href="https://github.com/davidortizjr"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
        >
          <span className="dock-icon-surface dock-icon-surface-github">
            <img className="dock-icon-glyph" src={logoGithub} alt="" aria-hidden="true" decoding="async" />
          </span>
          <span className="dock-tooltip">GitHub</span>
        </a>
        <a
          className="dock-item social"
          href="https://www.linkedin.com/in/david-ortiz-446012374/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
        >
          <span className="dock-icon-surface dock-icon-surface-linkedin">
            <img className="dock-icon-glyph" src={logoLinkedin} alt="" aria-hidden="true" decoding="async" />
          </span>
          <span className="dock-tooltip">LinkedIn</span>
        </a>
      </div>
    </footer>
  );
};

export default Dock;

