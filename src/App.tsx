import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./App.css";
import DesktopShortcuts from "./components/DesktopShortcuts";
import Dock from "./components/Dock";
import FinderWindow from "./components/FinderWindow";
import HeroSection from "./components/HeroSection";
import MenuBar from "./components/MenuBar";

const APPLE_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [clock, setClock] = useState(() => APPLE_DATE_FORMAT.format(new Date()));
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [finderOrigin, setFinderOrigin] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isFinderMounted, setIsFinderMounted] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  const openFinder = () => {
    setIsFinderMounted(true);
    setIsFinderOpen(true);
  };

  const closeFinder = (clearProjectsState = true) => {
    setIsFinderOpen(false);
    if (clearProjectsState) {
      setActiveAppId((prev) => (prev === "projects" ? null : prev));
    }
  };

  const handleFinderClosed = () => {
    setIsFinderMounted(false);
  };

  const toggleApp = (
    appId: string,
    origin?: { left: number; top: number; width: number; height: number }
  ) => {
    if (appId === "projects") {
      if (origin) {
        setFinderOrigin(origin);
      }

      if (isFinderMounted && isFinderOpen) {
        closeFinder();
        return;
      }

      // If Finder is currently animating closed, ignore repeated toggles.
      if (isFinderMounted && !isFinderOpen) {
        return;
      }

      setActiveAppId("projects");
      openFinder();
      return;
    }

    setActiveAppId(appId);
    closeFinder(false);
  };

  useGSAP(
    () => {
      gsap.from(".menu-bar", { y: -18, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".desktop-icon", {
        x: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.25,
        ease: "power2.out",
      });
      gsap.from(".dock", { y: 50, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
    },
    { scope: rootRef }
  );

  useGSAP(() => {
    const timer = window.setInterval(() => {
      setClock(APPLE_DATE_FORMAT.format(new Date()));
    }, 1000 * 15);

    return () => window.clearInterval(timer);
  });

  return (
    <div className="mac-root" ref={rootRef}>
      <div className="wallpaper-layer" aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />

      <MenuBar clock={clock} />

      <main className="desktop-space">
        {isFinderMounted ? (
          <FinderWindow
            isOpen={isFinderOpen}
            origin={finderOrigin}
            onClose={() => closeFinder()}
            onClosed={handleFinderClosed}
          />
        ) : (
          <HeroSection />
        )}

        <DesktopShortcuts />
      </main>

      <Dock activeAppId={activeAppId} onToggleApp={toggleApp} />
    </div>
  );
};

export default App;