import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./App.css";
import DesktopShortcuts from "./components/DesktopShortcuts";
import Dock from "./components/Dock";
import HeroSection from "./components/HeroSection";
import MenuBar from "./components/MenuBar";
import { APPLE_DATE_FORMAT, CLOCK_UPDATE_INTERVAL } from "./constants/formatting";
import { useClock } from "./hooks/useAnimations";

const loadFinderWindow = () => import("./components/dock_windows/FinderWindow");
const loadAboutMeWindow = () => import("./components/dock_windows/AboutMeWindow");
const loadContactWindows = () => import("./components/dock_windows/ContactWindows");
const loadTrashWindow = () => import("./components/dock_windows/TrashWindow");
const loadFileViewerWindow = () => import("./components/FileViewerWindow");
const loadMobileIphoneShell = () => import("./components/MobileIphoneShell");

const FinderWindow = lazy(loadFinderWindow);
const AboutMeWindow = lazy(loadAboutMeWindow);
const ContactWindows = lazy(loadContactWindows);
const TrashWindow = lazy(loadTrashWindow);
const FileViewerWindow = lazy(loadFileViewerWindow);
const MobileIphoneShell = lazy(loadMobileIphoneShell);

type ViewerFile = {
  id: string;
  title: string;
  src: string;
  description: string;
};

type WindowOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type DockWindowId = "projects" | "about" | "contact" | "trash";

const isDockWindowId = (appId: string): appId is DockWindowId => {
  return appId === "projects" || appId === "about" || appId === "contact" || appId === "trash";
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
  const [openDockWindow, setOpenDockWindow] = useState<DockWindowId | null>(null);
  const [windowOrigins, setWindowOrigins] = useState<Record<DockWindowId, WindowOrigin | null>>({
    projects: null,
    about: null,
    contact: null,
    trash: null,
  });
  const [viewerFile, setViewerFile] = useState<ViewerFile | null>(null);

  const closeDockWindow = useCallback((windowId: DockWindowId, clearActiveState = true) => {
    setOpenDockWindow((prev) => (prev === windowId ? null : prev));
    if (clearActiveState) {
      setActiveAppId((prev) => (prev === windowId ? null : prev));
    }
  }, []);

  const openViewer = useCallback((file: ViewerFile) => {
    setViewerFile(file);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerFile(null);
  }, []);

  const prefetchApp = useCallback((appId: string) => {
    switch (appId) {
      case "projects":
        void loadFinderWindow();
        return;
      case "about":
        void loadAboutMeWindow();
        return;
      case "contact":
        void loadContactWindows();
        return;
      case "trash":
        void loadTrashWindow();
        return;
      default:
        return;
    }
  }, []);

  const toggleApp = useCallback((appId: string, origin?: WindowOrigin) => {
    if (isDockWindowId(appId)) {
      if (origin) {
        setWindowOrigins((prev) => ({ ...prev, [appId]: origin }));
      }

      if (openDockWindow === appId) {
        closeDockWindow(appId);
        return;
      }

      setActiveAppId(appId);
      setOpenDockWindow(appId);
      return;
    }

    setActiveAppId(appId);
    setOpenDockWindow(null);
  }, [closeDockWindow, openDockWindow]);

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
      <Suspense fallback={null}>
        <MobileIphoneShell clock={clock} onOpenFile={openViewer} />
        <FileViewerWindow isOpen={Boolean(viewerFile)} file={viewerFile} onClose={closeViewer} />
      </Suspense>
    );
  }

  return (
    <div className="mac-root" ref={rootRef}>
      <div className="wallpaper-layer" aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />

      <MenuBar clock={clock} />

      <main className="desktop-space">
        <Suspense fallback={null}>
          <FinderWindow
            isOpen={openDockWindow === "projects"}
            origin={windowOrigins.projects}
            onClose={() => closeDockWindow("projects")}
            onMinimize={() => closeDockWindow("projects", false)}
            onClosed={() => { }}
            onOpenFile={openViewer}
          />
          <AboutMeWindow
            isOpen={openDockWindow === "about"}
            origin={windowOrigins.about}
            onClose={() => closeDockWindow("about")}
            onMinimize={() => closeDockWindow("about", false)}
            onClosed={() => { }}
          />
          <ContactWindows
            isOpen={openDockWindow === "contact"}
            origin={windowOrigins.contact}
            onClose={() => closeDockWindow("contact")}
            onMinimize={() => closeDockWindow("contact", false)}
            onClosed={() => { }}
          />
          <TrashWindow
            isOpen={openDockWindow === "trash"}
            origin={windowOrigins.trash}
            onClose={() => closeDockWindow("trash")}
            onMinimize={() => closeDockWindow("trash", false)}
            onClosed={() => { }}
          />
        </Suspense>
        {!openDockWindow && <HeroSection />}

        <DesktopShortcuts onOpenFile={openViewer} />
      </main>

      <Suspense fallback={null}>
        <FileViewerWindow isOpen={Boolean(viewerFile)} file={viewerFile} onClose={closeViewer} />
      </Suspense>
      <Dock activeAppId={activeAppId} onToggleApp={toggleApp} onPrefetchApp={prefetchApp} />
    </div>
  );
};

export default App;