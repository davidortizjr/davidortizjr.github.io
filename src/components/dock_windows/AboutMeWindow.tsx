import { useRef, useState, useEffect } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Code2, Zap, Palette, Users } from "lucide-react";

type AboutMeWindowProps = {
    isOpen: boolean;
    origin?: { left: number; top: number; width: number; height: number } | null;
    onClose?: () => void;
    onMinimize?: () => void;
    onClosed?: () => void;
};

const AboutMeWindow = ({ isOpen, origin, onClose, onMinimize, onClosed }: AboutMeWindowProps) => {
    const aboutRef = useRef<HTMLElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const originRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const restorePositionRef = useRef<{ x: number; y: number } | null>(null);
    const hasOpenedOnceRef = useRef(false);
    const dragStateRef = useRef<{
        isDragging: boolean;
        offsetX: number;
        offsetY: number;
    }>({ isDragging: false, offsetX: 0, offsetY: 0 });

    const [shellPosition, setShellPosition] = useState<{ x: number; y: number }>(() => {
        if (typeof window === "undefined") {
            return { x: 0, y: 0 };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    });
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsZoomed(false);
        }
    }, [isOpen]);

    // Update origin ref immediately when origin prop changes
    useEffect(() => {
        if (origin) {
            originRef.current = origin;
        }
    }, [origin]);

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

    // Handle dragging with proper cleanup
    useEffect(() => {
        if (!isOpen) {
            return;
        }

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
            const nextX = Math.min(Math.max(rawX, minX), maxX);
            const nextY = Math.min(Math.max(rawY, minY), maxY);

            setShellPosition({ x: nextX, y: nextY });
        };

        const handlePointerUp = () => {
            dragStateRef.current.isDragging = false;
            const shell = shellRef.current;
            if (shell) {
                shell.classList.remove("is-dragging");
            }
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isOpen]);

    // Handle opening and closing animations
    useGSAP(
        () => {
            const about = aboutRef.current;
            if (!about) {
                return;
            }

            const aboutRect = about.getBoundingClientRect();

            // Fallback to approximate dock position (bottom center)
            const fallbackOrigin = originRef.current || {
                left: window.innerWidth / 2,
                top: window.innerHeight - 80,
                width: 72,
                height: 72,
            };

            const sourceCenterX = fallbackOrigin.left + fallbackOrigin.width / 2;
            const sourceCenterY = fallbackOrigin.top + fallbackOrigin.height / 2;
            const aboutCenterX = aboutRect.left + aboutRect.width / 2;
            const aboutCenterY = aboutRect.top + aboutRect.height / 2;
            const fromX = sourceCenterX - aboutCenterX;
            const fromY = sourceCenterY - aboutCenterY;
            const fromScaleRaw = fallbackOrigin.width / aboutRect.width;
            const fromScale = Math.min(Math.max(fromScaleRaw, 0.08), 0.32);

            gsap.set(about, { transformOrigin: "50% 100%", transformPerspective: 900, force3D: true });

            if (isOpen) {
                hasOpenedOnceRef.current = true;
                gsap.killTweensOf([about]);
                gsap.fromTo(
                    about,
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
                return;
            }

            if (!hasOpenedOnceRef.current) {
                gsap.killTweensOf([about]);
                gsap.set(about, {
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

            // Closing animation
            gsap.killTweensOf([about]);
            gsap.to(about, {
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
        { scope: aboutRef, dependencies: [isOpen, origin, onClosed] }
    );

    return (
        <div
            className={`about-shell${isOpen ? " is-open" : " is-closing"}${isZoomed ? " is-zoomed" : ""}`}
            ref={shellRef}
            style={{ left: `${shellPosition.x}px`, top: `${shellPosition.y}px` }}
            aria-label="About Me window"
        >
            <section className="about-window" ref={aboutRef}>
                <div className="about-header" onPointerDown={handleWindowPointerDown}>
                    <div className="traffic-lights" role="group" aria-label="About window controls">
                        <button type="button" className="traffic traffic-button red" onClick={onClose} aria-label="Close window">
                            <span className="traffic-symbol" aria-hidden="true">×</span>
                        </button>
                        <button type="button" className="traffic traffic-button yellow" onClick={handleMinimize} aria-label="Minimize window">
                            <span className="traffic-symbol" aria-hidden="true">−</span>
                        </button>
                        <button type="button" className="traffic traffic-button green" onClick={handleZoomToggle} aria-label={isZoomed ? "Restore window size" : "Zoom window"}>
                            <span className="traffic-symbol" aria-hidden="true">+</span>
                        </button>
                    </div>
                    <div className="about-header-content">
                        <h1>About Me</h1>
                        <p>Full Stack Developer & Digital Creative</p>
                    </div>
                </div>

                <div className="about-content">
                    <div className="about-intro">
                        <p>
                            Hi! I'm David, a 21-year-old Full Stack Web Developer with a knack for building products that make
                            a difference. My expertise spans both frontend and backend technologies, enabling me to
                            craft comprehensive solutions from the ground up.
                        </p>
                    </div>

                    <div className="about-skills">
                        <div className="skill-group">
                            <div className="skill-icon">
                                <Code2 size={20} />
                            </div>
                            <div className="skill-content">
                                <h3>Development</h3>
                                <p>Full Stack • React • TypeScript • Node.js • JavaScript • PHP • Express.js • ASP.NET</p>
                            </div>
                        </div>

                        <div className="skill-group">
                            <div className="skill-icon">
                                <Palette size={20} />
                            </div>
                            <div className="skill-content">
                                <h3>Design</h3>
                                <p>UI/UX • Responsive Design • GSAP Animation • Figma • CSS • Tailwind • Bootstrap</p>
                            </div>
                        </div>

                        <div className="skill-group">
                            <div className="skill-icon">
                                <Zap size={20} />
                            </div>
                            <div className="skill-content">
                                <h3>Performance</h3>
                                <p>Web Optimization • SEO • Accessibility • Best Practices</p>
                            </div>
                        </div>

                        <div className="skill-group">
                            <div className="skill-icon">
                                <Users size={20} />
                            </div>
                            <div className="skill-content">
                                <h3>Collaboration</h3>
                                <p>Problem Solving • Communication • Team Leadership • Mentoring</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-footer">
                        <p>
                            Let's work together to bring your ideas to life. Whether you're looking for a solid developer or a
                            creative partner, I'd love to help.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutMeWindow;