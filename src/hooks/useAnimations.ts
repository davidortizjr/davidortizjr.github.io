import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const useDockHoverAnimation = (dockRef: RefObject<HTMLDivElement | null>): void => {
    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) {
            return;
        }

        const icons = dock.querySelectorAll<HTMLElement>(".dock-item");
        let frameId: number | null = null;
        let pendingMouseX = 0;
        let dockLeft = 0;
        let iconCenters: number[] = [];

        const recalculateDockMetrics = () => {
            const dockRect = dock.getBoundingClientRect();
            dockLeft = dockRect.left;
            iconCenters = Array.from(icons).map((icon) => {
                const { left, width } = icon.getBoundingClientRect();
                return left - dockRect.left + width / 2;
            });
        };

        const animateIcons = (mouseX: number) => {
            const radius = 120;

            icons.forEach((icon, index) => {
                const center = iconCenters[index];
                const distance = Math.abs(mouseX - center);
                const direction = mouseX >= center ? -1 : 1;

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
            pendingMouseX = event.clientX - dockLeft;

            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(() => {
                frameId = null;
                animateIcons(pendingMouseX);
            });
        };

        const handleMouseEnter = () => {
            recalculateDockMetrics();
        };

        const handleResize = () => {
            recalculateDockMetrics();
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

        recalculateDockMetrics();
        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseenter", handleMouseEnter);
        dock.addEventListener("mouseleave", resetIcons);
        window.addEventListener("resize", handleResize);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseenter", handleMouseEnter);
            dock.removeEventListener("mouseleave", resetIcons);
            window.removeEventListener("resize", handleResize);

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
                frameId = null;
            }

            resetIcons();
        };
    });
};

export const useTextLetterAnimation = (
    containerRef: RefObject<HTMLParagraphElement | HTMLHeadingElement | null>,
    fontWeights: { min: number; max: number; default: number }
): void => {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) {
            return () => { };
        }

        const letters = container.querySelectorAll<HTMLElement>(".hero-letter");
        const { min, max, default: base } = fontWeights;
        let frameId: number | null = null;
        let pendingMouseX = 0;
        let letterCenters: number[] = [];
        let containerLeft = 0;

        const recalculateMetrics = () => {
            const containerRect = container.getBoundingClientRect();
            containerLeft = containerRect.left;
            letterCenters = Array.from(letters).map((letter) => {
                const { left, width } = letter.getBoundingClientRect();
                return left - containerLeft + width / 2;
            });
        };

        const animateLetter = (letter: HTMLElement, weight: number, duration = 0.25) => {
            return gsap.to(letter, {
                duration,
                ease: "power2.out",
                fontVariationSettings: `'wght' ${weight}`,
                fontWeight: weight,
            });
        };

        letters.forEach((letter) => {
            animateLetter(letter, base, 0);
        });
        recalculateMetrics();

        const handleMouseMove = (event: MouseEvent) => {
            pendingMouseX = event.clientX - containerLeft;

            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(() => {
                frameId = null;
                const mouseX = pendingMouseX;

                letters.forEach((letter, index) => {
                    const distance = Math.abs(mouseX - letterCenters[index]);
                    const intensity = Math.exp(-(distance ** 2) / 2000);
                    const weight = Math.round(min + (max - min) * intensity);

                    animateLetter(letter, weight);
                });
            });
        };

        const handleMouseLeave = () => {
            letters.forEach((letter) => {
                animateLetter(letter, base, 0.3);
            });
        };

        const handleResize = () => {
            recalculateMetrics();
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
                frameId = null;
            }
        };
    });
};

export const useClock = (
    formatter: Intl.DateTimeFormat,
    updateInterval: number = 15000
): string => {
    const [clock, setClock] = useState(() => formatter.format(new Date()));

    useEffect(() => {
        const timer = window.setInterval(() => {
            setClock(formatter.format(new Date()));
        }, updateInterval);

        return () => window.clearInterval(timer);
    }, [formatter, updateInterval]);

    return clock;
};
