import { useEffect, useState, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const DOCK_ANIMATION_CONFIG = {
    RADIUS: 120,
    SCALE_INTENSITY: 0.42,
    Y_INTENSITY: 16,
    X_INTENSITY: 6,
    DURATION: 0.2,
    RESET_DURATION: 0.3,
} as const;

export const useDockHoverAnimation = (dockRef: RefObject<HTMLDivElement | null>): void => {
    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll<HTMLElement>(".dock-item");
        if (!icons.length) return;

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

        const resetIcon = (icon: HTMLElement) => {
            gsap.to(icon, {
                scale: 1,
                y: 0,
                x: 0,
                duration: DOCK_ANIMATION_CONFIG.RESET_DURATION,
                ease: "power1.out",
            });
        };

        const animateIcons = (mouseX: number) => {
            icons.forEach((icon, index) => {
                const center = iconCenters[index];
                if (center === undefined) return;

                const distance = Math.abs(mouseX - center);
                const { RADIUS, SCALE_INTENSITY, Y_INTENSITY, X_INTENSITY, DURATION } =
                    DOCK_ANIMATION_CONFIG;

                if (distance >= RADIUS) {
                    resetIcon(icon);
                    return;
                }

                const normalized = distance / RADIUS;
                const intensity = Math.exp(-((normalized * RADIUS) ** 2.5) / 6200);
                const direction = mouseX >= center ? -1 : 1;

                gsap.to(icon, {
                    scale: 1 + SCALE_INTENSITY * intensity,
                    y: -Y_INTENSITY * intensity,
                    x: direction * X_INTENSITY * intensity,
                    duration: DURATION,
                    ease: "power1.out",
                });
            });
        };

        const handleMouseMove = (event: MouseEvent) => {
            pendingMouseX = event.clientX - dockLeft;

            if (frameId !== null) return;

            frameId = window.requestAnimationFrame(() => {
                frameId = null;
                animateIcons(pendingMouseX);
            });
        };

        const handleMouseLeave = () => {
            icons.forEach(resetIcon);
        };

        const handleResize = () => {
            recalculateDockMetrics();
        };

        // Initialize
        recalculateDockMetrics();
        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize);

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);

            // Kill all GSAP animations on these elements
            icons.forEach((icon) => gsap.killTweensOf(icon));
            handleMouseLeave(); // Reset to default state
        };
    });
};

const TEXT_ANIMATION_CONFIG = {
    INTENSITY_DIVISOR: 2000,
    DURATION: 0.25,
    RESET_DURATION: 0.3,
} as const;

export const useTextLetterAnimation = (
    containerRef: RefObject<HTMLParagraphElement | HTMLHeadingElement | null>,
    fontWeights: { min: number; max: number; default: number }
): void => {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const letters = container.querySelectorAll<HTMLElement>(".hero-letter");
        if (!letters.length) return;

        const { min, max, default: baseWeight } = fontWeights;
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

        const animateLetter = (
            letter: HTMLElement,
            weight: number,
            duration: number = TEXT_ANIMATION_CONFIG.DURATION
        ) => {
            gsap.to(letter, {
                duration,
                ease: "power2.out",
                fontVariationSettings: `'wght' ${weight}`,
                fontWeight: weight,
            });
        };

        const resetLetters = () => {
            letters.forEach((letter) => {
                animateLetter(letter, baseWeight, TEXT_ANIMATION_CONFIG.RESET_DURATION);
            });
        };

        const handleMouseMove = (event: MouseEvent) => {
            pendingMouseX = event.clientX - containerLeft;

            if (frameId !== null) return;

            frameId = window.requestAnimationFrame(() => {
                frameId = null;

                letters.forEach((letter, index) => {
                    const distance = Math.abs(pendingMouseX - letterCenters[index]);
                    const intensity = Math.exp(-(distance ** 2) / TEXT_ANIMATION_CONFIG.INTENSITY_DIVISOR);
                    const weight = Math.round(min + (max - min) * intensity);

                    animateLetter(letter, weight);
                });
            });
        };

        const handleResize = () => {
            recalculateMetrics();
        };

        // Initialize
        recalculateMetrics();

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", resetLetters);
        window.addEventListener("resize", handleResize);

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", resetLetters);
            window.removeEventListener("resize", handleResize);

            // Kill all GSAP animations on these elements
            letters.forEach((letter) => gsap.killTweensOf(letter));
            resetLetters();
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
