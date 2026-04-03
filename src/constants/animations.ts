export const FONT_WEIGHTS = {
    kicker: { min: 420, max: 700, default: 430 },
    title: { min: 420, max: 760, default: 420 },
} as const;

export const HERO_KICKER = "Hey, I'm David! Welcome to my";
export const HERO_TITLE = "portfolio";

export const ANIMATION_DURATIONS = {
    menuBar: { duration: 0.8, ease: "power3.out" },
    desktopIcon: { baseDelay: 0.25, stagger: 0.1, duration: 0.7, ease: "power2.out" },
    dock: { duration: 0.8, delay: 0.4, ease: "power3.out" },
    heroKicker: { duration: 0.7, ease: "power2.out" },
    heroTitle: { duration: 0.8, delay: 0.1, ease: "power3.out" },
    heroActions: { duration: 0.7, delay: 0.25, ease: "power2.out" },
} as const;
