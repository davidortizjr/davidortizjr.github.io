import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./App.css";
import AboutMeWindow from "./components/AboutMeWindow";
import DesktopShortcuts from "./components/DesktopShortcuts";
import Dock from "./components/Dock";
import FinderWindow from "./components/FinderWindow";
import HeroSection from "./components/HeroSection";
import MenuBar from "./components/MenuBar";
import { APPLE_DATE_FORMAT, CLOCK_UPDATE_INTERVAL } from "./constants/formatting";
import { useClock } from "./hooks/useAnimations";

const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const clock = useClock(APPLE_DATE_FORMAT, CLOCK_UPDATE_INTERVAL);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [finderOrigin, setFinderOrigin] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [aboutOrigin, setAboutOrigin] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openFinder = (origin?: { left: number; top: number; width: number; height: number }) => {
    if (origin) {
      setFinderOrigin(origin);
    }
    setIsAboutOpen(false);
    setIsFinderOpen(true);
  };

  const closeFinder = (clearProjectsState = true) => {
    setIsFinderOpen(false);
    if (clearProjectsState) {
      setActiveAppId((prev) => (prev === "projects" ? null : prev));
    }
  };

  const openAbout = (origin?: { left: number; top: number; width: number; height: number }) => {
    if (origin) {
      setAboutOrigin(origin);
    }
    setIsFinderOpen(false);
    setIsAboutOpen(true);
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
    setActiveAppId((prev) => (prev === "about" ? null : prev));
  };

  const toggleApp = (
    appId: string,
    origin?: { left: number; top: number; width: number; height: number }
  ) => {
    if (appId === "projects") {
      if (isFinderOpen) {
        closeFinder();
        return;
      }

      setActiveAppId("projects");
      openFinder(origin);
      return;
    }

    if (appId === "about") {
      if (isAboutOpen) {
        closeAbout();
        return;
      }

      setActiveAppId("about");
      openAbout(origin);
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

  return (
    <div className="mac-root" ref={rootRef}>
      <div className="wallpaper-layer" aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />

      <MenuBar clock={clock} />

      <main className="desktop-space">
        <FinderWindow
          isOpen={isFinderOpen}
          origin={finderOrigin}
          onClose={() => closeFinder()}
          onClosed={() => { }}
        />
        <AboutMeWindow
          isOpen={isAboutOpen}
          origin={aboutOrigin}
          onClose={() => closeAbout()}
          onClosed={() => { }}
        />
        {!isFinderOpen && !isAboutOpen && <HeroSection />}

        <DesktopShortcuts />
      </main>

      <Dock activeAppId={activeAppId} onToggleApp={toggleApp} />
    </div>
  );
};

export default App;