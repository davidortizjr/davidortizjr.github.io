import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type ShellPosition = {
    x: number;
    y: number;
};

type UseDraggableWindowOptions = {
    isOpen: boolean;
    topBarHeight?: number;
    blockDragSelector?: string;
    draggingClassName?: string;
    onClampChange?: (isClamped: boolean, shell: HTMLDivElement) => void;
};

type DragState = {
    isDragging: boolean;
    offsetX: number;
    offsetY: number;
    pendingX: number;
    pendingY: number;
    frameId: number | null;
    wasClamped: boolean;
};

export const useDraggableWindow = ({
    isOpen,
    topBarHeight = 44,
    blockDragSelector = "button,a,input,textarea,select,[role='button']",
    draggingClassName = "is-dragging",
    onClampChange,
}: UseDraggableWindowOptions) => {
    const shellRef = useRef<HTMLDivElement>(null);
    const shellPositionRef = useRef<ShellPosition>({ x: 0, y: 0 });
    const dragStateRef = useRef<DragState>({
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        pendingX: 0,
        pendingY: 0,
        frameId: null,
        wasClamped: false,
    });

    const [shellPosition, setShellPosition] = useState<ShellPosition>(() => {
        if (typeof window === "undefined") {
            return { x: 0, y: 0 };
        }

        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };
    });

    useEffect(() => {
        shellPositionRef.current = shellPosition;
    }, [shellPosition]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const dragState = dragStateRef.current;
        const shellAtEffectStart = shellRef.current;

        const applyPendingPosition = () => {
            dragState.frameId = null;
            setShellPosition({
                x: dragState.pendingX,
                y: dragState.pendingY,
            });
        };

        const handlePointerMove = (event: PointerEvent) => {
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
            const isClamped = nextX !== rawX || nextY !== rawY;

            dragState.pendingX = nextX;
            dragState.pendingY = nextY;

            if (onClampChange && isClamped !== dragState.wasClamped) {
                onClampChange(isClamped, shell);
            }
            dragState.wasClamped = isClamped;

            if (dragState.frameId === null) {
                dragState.frameId = window.requestAnimationFrame(applyPendingPosition);
            }
        };

        const endDrag = () => {
            dragState.isDragging = false;
            dragState.wasClamped = false;

            const shell = shellRef.current;
            if (shell) {
                shell.classList.remove(draggingClassName);
                onClampChange?.(false, shell);
            }
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", endDrag);
            window.removeEventListener("pointercancel", endDrag);

            if (dragState.frameId !== null) {
                window.cancelAnimationFrame(dragState.frameId);
                dragState.frameId = null;
            }

            if (shellAtEffectStart) {
                shellAtEffectStart.classList.remove(draggingClassName);
            }
        };
    }, [draggingClassName, isOpen, onClampChange]);

    const handleWindowPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest(blockDragSelector)) {
            return;
        }

        const windowElement = event.currentTarget;
        const windowRect = windowElement.getBoundingClientRect();
        const isInTopBar = event.clientY - windowRect.top <= topBarHeight;

        if (!isInTopBar) {
            return;
        }

        const shell = shellRef.current;
        if (!shell) {
            return;
        }

        const dragState = dragStateRef.current;
        dragState.isDragging = true;
        dragState.offsetX = event.clientX - shellPositionRef.current.x;
        dragState.offsetY = event.clientY - shellPositionRef.current.y;
        dragState.pendingX = shellPositionRef.current.x;
        dragState.pendingY = shellPositionRef.current.y;
        shell.classList.add(draggingClassName);

        windowElement.setPointerCapture(event.pointerId);
    };

    return {
        shellRef,
        shellPosition,
        setShellPosition,
        handleWindowPointerDown,
    };
};
