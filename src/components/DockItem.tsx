import type { CSSProperties } from "react";

type DockItemProps = {
    id: string;
    name: string;
    Icon: React.ComponentType<{ size: number; strokeWidth: number }>;
    isActive: boolean;
    canOpen: boolean;
    accent?: string;
    onToggle: (
        id: string,
        origin: { left: number; top: number; width: number; height: number }
    ) => void;
    onPrefetch?: (id: string) => void;
};

const DockItem = ({
    id,
    name,
    Icon,
    isActive,
    canOpen,
    accent,
    onToggle,
    onPrefetch,
}: DockItemProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!canOpen) return;
        const button = event.currentTarget;
        const { left, top, width, height } = button.getBoundingClientRect();
        onToggle(id, { left, top, width, height });
    };

    return (
        <button
            type="button"
            className={`dock-item${isActive ? " active" : ""}`}
            disabled={!canOpen}
            aria-label={name}
            data-tooltip-id="dock-tooltip"
            data-tooltip-content={name}
            onClick={handleClick}
            onMouseEnter={() => onPrefetch?.(id)}
            onFocus={() => onPrefetch?.(id)}
            style={
                isActive
                    ? ({
                        "--icon-accent": accent,
                    } as CSSProperties)
                    : undefined
            }
        >
            <span
                className={`dock-icon-surface dock-icon-surface-${id}`}
                style={{ "--icon-accent": accent } as CSSProperties}
            >
                <Icon size={24} strokeWidth={2.2} />
            </span>
            <span className="dock-tooltip">{name}</span>
            {isActive && <i className="dock-running-dot" aria-hidden="true" />}
        </button>
    );
};

export default DockItem;
