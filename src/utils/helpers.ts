export const splitTextIntoCharacters = (text: string): string[] => {
    return text.split("").map((char) => (char === " " ? "\u00A0" : char));
};

export const clampValue = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const calculateGaussianIntensity = (distance: number, spread: number = 2000): number => {
    return Math.exp(-(distance ** 2) / spread);
};

export const getInitialShellPosition = (): { x: number; y: number } => {
    if (typeof window === "undefined") {
        return { x: 0, y: 0 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
};

export const getInitialViewMode = (storageKey: string): "details" | "icons" => {
    if (typeof window === "undefined") {
        return "details";
    }
    const stored = window.localStorage.getItem(storageKey);
    return stored === "icons" ? "icons" : "details";
};
