import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Code2, Link2, Mail, MessageCircle } from "lucide-react";
import { useDraggableWindow } from "../../hooks/useDraggableWindow";

type ContactWindowsProps = {
    isOpen: boolean;
    origin?: { left: number; top: number; width: number; height: number } | null;
    onClose?: () => void;
    onMinimize?: () => void;
    onClosed?: () => void;
};

const contactLinks = [
    {
        id: "email",
        label: "Email",
        detail: "davidgortizjr@gmail.com",
        href: "mailto:davidgortizjr@gmail.com",
        icon: Mail,
    },
    {
        id: "github",
        label: "GitHub",
        detail: "github.com/davidortizjr",
        href: "https://github.com/davidortizjr",
        icon: Code2,
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        detail: "linkedin.com/in/david-ortiz-446012374",
        href: "https://www.linkedin.com/in/david-ortiz-446012374/",
        icon: Link2,
    },
];

const ContactWindows = ({ isOpen, origin, onClose, onMinimize, onClosed }: ContactWindowsProps) => {
    const contactRef = useRef<HTMLElement>(null);
    const originRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const restorePositionRef = useRef<{ x: number; y: number } | null>(null);
    const hasOpenedOnceRef = useRef(false);
    const { shellRef, shellPosition, setShellPosition, handleWindowPointerDown } = useDraggableWindow({
        isOpen,
        blockDragSelector: "button,a",
        topBarHeight: 44,
    });
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        if (origin) {
            originRef.current = origin;
        }
    }, [origin]);

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

    useGSAP(
        () => {
            const contact = contactRef.current;
            if (!contact) {
                return;
            }

            const items = contact.querySelectorAll<HTMLElement>(".contact-window-item");
            const contactRect = contact.getBoundingClientRect();

            const fallbackOrigin = originRef.current || {
                left: window.innerWidth / 2,
                top: window.innerHeight - 80,
                width: 72,
                height: 72,
            };

            const sourceCenterX = fallbackOrigin.left + fallbackOrigin.width / 2;
            const sourceCenterY = fallbackOrigin.top + fallbackOrigin.height / 2;
            const contactCenterX = contactRect.left + contactRect.width / 2;
            const contactCenterY = contactRect.top + contactRect.height / 2;
            const fromX = sourceCenterX - contactCenterX;
            const fromY = sourceCenterY - contactCenterY;
            const fromScaleRaw = fallbackOrigin.width / contactRect.width;
            const fromScale = Math.min(Math.max(fromScaleRaw, 0.08), 0.32);

            gsap.set(contact, { transformOrigin: "50% 100%", transformPerspective: 900, force3D: true });

            if (isOpen) {
                hasOpenedOnceRef.current = true;
                gsap.killTweensOf([contact, ...items]);
                gsap.fromTo(
                    contact,
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
                gsap.killTweensOf([contact, ...items]);
                gsap.set(contact, {
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

            gsap.killTweensOf([contact, ...items]);
            gsap.to(contact, {
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
        { scope: contactRef, dependencies: [isOpen, origin, onClosed] }
    );

    return (
        <div
            className={`contact-shell${isOpen ? " is-open" : " is-closing"}${isZoomed ? " is-zoomed" : ""}`}
            ref={shellRef}
            style={{ transform: `translate3d(${shellPosition.x}px, ${shellPosition.y}px, 0) translate(-50%, -50%)` }}
            aria-label="Contact window"
        >
            <section className="contact-window" ref={contactRef}>
                <div className="contact-header" onPointerDown={handleWindowPointerDown}>
                    <div className="traffic-lights" role="group" aria-label="Contact window controls">
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
                    <div className="contact-header-content">
                        <h1>Contact</h1>
                        <p>Let's build something useful</p>
                    </div>
                </div>

                <div className="contact-content">
                    <div className="contact-intro contact-window-item">
                        <MessageCircle size={18} />
                        <div>
                            <h2>Reach out directly</h2>
                            <p>
                                Open to frontend, full stack, and UI-heavy work. These links go straight to my active profiles.
                            </p>
                        </div>
                    </div>

                    <div className="contact-links">
                        {contactLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <a
                                    key={link.id}
                                    className="contact-link contact-window-item"
                                    href={link.href}
                                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                    rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                                >
                                    <span className="contact-link-icon">
                                        <Icon size={18} />
                                    </span>
                                    <span className="contact-link-copy">
                                        <strong>{link.label}</strong>
                                        <span>{link.detail}</span>
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    <div className="contact-footer contact-window-item">
                        <p>
                            If you're trying to contact me about the portfolio, the GitHub repo, or a project idea, start with
                            email or LinkedIn.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactWindows;