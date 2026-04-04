import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./App.css";
import AboutMeWindow from "./components/dock_windows/AboutMeWindow";
import DesktopShortcuts from "./components/DesktopShortcuts";
import Dock from "./components/Dock";
import FileViewerWindow from "./components/FileViewerWindow";
import FinderWindow from "./components/dock_windows/FinderWindow";
import HeroSection from "./components/HeroSection";
import MenuBar from "./components/MenuBar";
import MobileIphoneShell from "./components/MobileIphoneShell";
import ContactWindows from "./components/dock_windows/ContactWindows";
import { APPLE_DATE_FORMAT, CLOCK_UPDATE_INTERVAL } from "./constants/formatting";
import { useClock } from "./hooks/useAnimations";

type ViewerFile = {
  id: string;
  title: string;
  src: string;
  description: string;
};

const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const clock = useClock(APPLE_DATE_FORMAT, CLOCK_UPDATE_INTERVAL);
  const [isPhoneViewport, setIsPhoneViewport] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 720px)").matches;
  });
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
  const [contactOrigin, setContactOrigin] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [viewerFile, setViewerFile] = useState<ViewerFile | null>(null);

  const openFinder = (origin?: { left: number; top: number; width: number; height: number }) => {
    if (origin) {
      setFinderOrigin(origin);
    }
    setIsAboutOpen(false);
    setIsContactOpen(false);
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
    setIsContactOpen(false);
    setIsAboutOpen(true);
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
    setActiveAppId((prev) => (prev === "about" ? null : prev));
  };

  const openContact = (origin?: { left: number; top: number; width: number; height: number }) => {
    if (origin) {
      setContactOrigin(origin);
    }
    setIsFinderOpen(false);
    setIsAboutOpen(false);
    setIsContactOpen(true);
  };

  const closeContact = () => {
    setIsContactOpen(false);
    setActiveAppId((prev) => (prev === "contact" ? null : prev));
  };

  const openViewer = (file: ViewerFile) => {
    setViewerFile(file);
  };

  const closeViewer = () => {
    setViewerFile(null);
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

    if (appId === "contact") {
      if (isContactOpen) {
        closeContact();
        return;
      }

      setActiveAppId("contact");
      openContact(origin);
      return;
    }

    setActiveAppId(appId);
    closeFinder(false);
    setIsAboutOpen(false);
    setIsContactOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const handleChange = () => {
      setIsPhoneViewport(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useGSAP(
    () => {
      if (isPhoneViewport) {
        return;
      }

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
    { scope: rootRef, dependencies: [isPhoneViewport] }
  );

  if (isPhoneViewport) {
    return (
      <>
        <MobileIphoneShell clock={clock} onOpenFile={openViewer} />
        <FileViewerWindow isOpen={Boolean(viewerFile)} file={viewerFile} onClose={closeViewer} />
      </>
    );
  }

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
          onOpenFile={openViewer}
        />
        <AboutMeWindow
          isOpen={isAboutOpen}
          origin={aboutOrigin}
          onClose={() => closeAbout()}
          onClosed={() => { }}
        />
        <ContactWindows
          isOpen={isContactOpen}
          origin={contactOrigin}
          onClose={() => closeContact()}
          onClosed={() => { }}
        />
        {!isFinderOpen && !isAboutOpen && !isContactOpen && <HeroSection />}

        <DesktopShortcuts onOpenFile={openViewer} />
      </main>

      <FileViewerWindow isOpen={Boolean(viewerFile)} file={viewerFile} onClose={closeViewer} />
      <Dock activeAppId={activeAppId} onToggleApp={toggleApp} />
    </div>
  );
};

export default App;