export type DockAppId = "projects" | "about" | "contact" | "trash";

export type ViewMode = "details" | "icons";

export type ToneColor = "blue" | "red" | "violet";

export type WindowPosition = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type DragState = {
    isDragging: boolean;
    offsetX: number;
    offsetY: number;
};

export type ShellPosition = {
    x: number;
    y: number;
};
