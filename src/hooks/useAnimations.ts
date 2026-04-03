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

        const animateIcons = (mouseX: number) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const direction = mouseX >= center ? -1 : 1;
                const radius = 120;

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
            const { left } = dock.getBoundingClientRect();
            animateIcons(event.clientX - left);
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

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
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

        const letters = container.querySelectorAll<HTMLElement>("span");
        const { min, max, default: base } = fontWeights;

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

        const handleMouseMove = (event: MouseEvent) => {
            const { left } = container.getBoundingClientRect();
            const mouseX = event.clientX - left;

            letters.forEach((letter) => {
                const { left: letterLeft, width } = letter.getBoundingClientRect();
                const distance = Math.abs(mouseX - (letterLeft - left + width / 2));
                const intensity = Math.exp(-(distance ** 2) / 2000);
                const weight = Math.round(min + (max - min) * intensity);

                animateLetter(letter, weight);
            });
        };

        const handleMouseLeave = () => {
            letters.forEach((letter) => {
                animateLetter(letter, base, 0.3);
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
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
