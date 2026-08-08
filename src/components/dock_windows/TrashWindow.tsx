import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Trash2, RotateCcw, Eraser, Archive } from "lucide-react";
import { useDraggableWindow } from "../../hooks/useDraggableWindow";

type TrashWindowProps = {
    isOpen: boolean;
    origin?: { left: number; top: number; width: number; height: number } | null;
    onClose?: () => void;
    onMinimize?: () => void;
    onClosed?: () => void;
};

const trashItems = [
    {
        id: "old-prototype",
        name: "Old Prototype.fig",
        detail: "Deleted 2 days ago",
        icon: Archive,
    },
    {
        id: "notes-draft",
        name: "Notes_Draft.txt",
        detail: "Deleted yesterday",
        icon: Trash2,
    },
    {
        id: "temp-assets",
        name: "Temp Assets.zip",
        detail: "Deleted this week",
        icon: Eraser,
    },
];

const TrashWindow = ({ isOpen, origin, onClose, onMinimize, onClosed }: TrashWindowProps) => {
    const trashRef = useRef<HTMLElement>(null);
    const originRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const restorePositionRef = useRef<{ x: number; y: number } | null>(null);
    const hasOpenedOnceRef = useRef(false);
    const [items, setItems] = useState(trashItems);
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

    const handleRestoreItem = (itemId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    };

    useGSAP(
        () => {
            const trash = trashRef.current;
            if (!trash) {
                return;
            }

            const items = trash.querySelectorAll<HTMLElement>(".trash-window-item");
            const trashRect = trash.getBoundingClientRect();

            const fallbackOrigin = originRef.current || {
                left: window.innerWidth / 2,
                top: window.innerHeight - 80,
                width: 72,
                height: 72,
            };

            const sourceCenterX = fallbackOrigin.left + fallbackOrigin.width / 2;
            const sourceCenterY = fallbackOrigin.top + fallbackOrigin.height / 2;
            const trashCenterX = trashRect.left + trashRect.width / 2;
            const trashCenterY = trashRect.top + trashRect.height / 2;
            const fromX = sourceCenterX - trashCenterX;
            const fromY = sourceCenterY - trashCenterY;
            const fromScaleRaw = fallbackOrigin.width / trashRect.width;
            const fromScale = Math.min(Math.max(fromScaleRaw, 0.08), 0.32);

            gsap.set(trash, { transformOrigin: "50% 100%", transformPerspective: 900, force3D: true });

            if (isOpen) {
                hasOpenedOnceRef.current = true;
                gsap.killTweensOf([trash, ...items]);
                gsap.fromTo(
                    trash,
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
                gsap.killTweensOf([trash, ...items]);
                gsap.set(trash, {
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

            gsap.killTweensOf([trash, ...items]);
            gsap.to(trash, {
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
        { scope: trashRef, dependencies: [isOpen, origin, onClosed] }
    );

    return (
        <div
            className={`contact-shell trash-shell${isOpen ? " is-open" : " is-closing"}${isZoomed ? " is-zoomed" : ""}`}
            ref={shellRef}
            style={{ transform: `translate3d(${shellPosition.x}px, ${shellPosition.y}px, 0) translate(-50%, -50%)` }}
            aria-label="Trash window"
        >
            <section className="contact-window trash-window" ref={trashRef}>
                <div className="contact-header trash-header" onPointerDown={handleWindowPointerDown}>
                    <div className="traffic-lights" role="group" aria-label="Trash window controls">
                        <button type="button" className="traffic traffic-button red" onClick={onClose} aria-label="Close trash">
                            <span className="traffic-symbol" aria-hidden="true">×</span>
                        </button>
                        <button type="button" className="traffic traffic-button yellow" onClick={handleMinimize} aria-label="Minimize trash">
                            <span className="traffic-symbol" aria-hidden="true">−</span>
                        </button>
                        <button type="button" className="traffic traffic-button green" onClick={handleZoomToggle} aria-label={isZoomed ? "Restore trash size" : "Zoom trash"}>
                            <span className="traffic-symbol" aria-hidden="true">+</span>
                        </button>
                    </div>
                    <div className="contact-header-content trash-header-content">
                        <h1>Trash</h1>
                        <p>Recently deleted items</p>
                    </div>
                </div>

                <div className="contact-content trash-content">
                    <div className="contact-intro trash-window-item">
                        <Trash2 size={18} />
                        <div>
                            <h2>Recover or empty deleted items</h2>
                            <p>
                                This is your staging area for files you’ve removed. You can restore items or empty the trash when
                                you’re ready.
                            </p>
                        </div>
                    </div>

                    <div className="trash-list">
                        {items.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.id} className="trash-item trash-window-item">
                                    <span className="trash-item-icon">
                                        <Icon size={18} />
                                    </span>
                                    <span className="trash-item-copy">
                                        <strong>{item.name}</strong>
                                        <span>{item.detail}</span>
                                    </span>
                                    <button type="button" className="trash-item-action" onClick={() => handleRestoreItem(item.id)} aria-label={`Restore ${item.name}`}>
                                        <RotateCcw size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="contact-footer trash-window-item">
                        <p>
                            Emptying the trash permanently removes items. Restoring an item returns it to its original location.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TrashWindow;