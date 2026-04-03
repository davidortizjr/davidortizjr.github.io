import gsap from "gsap";

export const calculateDockItemIntensity = (
    mouseX: number,
    iconCenter: number,
    radius: number
): number => {
    const distance = Math.abs(mouseX - iconCenter);
    if (distance >= radius) return 0;

    const normalized = distance / radius;
    return Math.exp(-((normalized * radius) ** 2.5) / 6200);
};

export const animateDockItem = (
    icon: HTMLElement,
    intensity: number,
    mouseX: number,
    iconCenter: number
): void => {
    const direction = mouseX >= iconCenter ? -1 : 1;

    gsap.to(icon, {
        scale: 1 + 0.42 * intensity,
        y: -16 * intensity,
        x: direction * 6 * intensity,
        duration: 0.2,
        ease: "power1.out",
    });
};

export const resetDockItem = (icon: HTMLElement): void => {
    gsap.to(icon, {
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.3,
        ease: "power1.out",
    });
};

export const animateLetter = (
    letter: HTMLElement,
    weight: number,
    duration = 0.25
): void => {
    gsap.to(letter, {
        duration,
        ease: "power2.out",
        fontVariationSettings: `'wght' ${weight}`,
        fontWeight: weight,
    });
};
