import { desktopIcons } from "../data/desktopData";

type ViewerFile = {
  id: string;
  title: string;
  src: string;
  description: string;
};

type DesktopShortcutsProps = {
  onOpenFile?: (file: ViewerFile) => void;
};

const DesktopShortcuts = ({ onOpenFile }: DesktopShortcutsProps) => {
  const handleShortcutClick = (shortcutId: string) => {
    const shortcut = desktopIcons.find((entry) => entry.id === shortcutId);
    if (!shortcut?.previewUrl || !onOpenFile) {
      return;
    }

    onOpenFile({
      id: shortcut.id,
      title: shortcut.label,
      src: shortcut.previewUrl,
      description: "PDF Document",
    });
  };

  return (
    <aside className="desktop-shortcuts">
      {desktopIcons.map((shortcut) => {
        const Icon = shortcut.icon;
        const canOpen = Boolean(shortcut.previewUrl && onOpenFile);
        return (
          <button
            type="button"
            className={`desktop-icon${canOpen ? " is-clickable" : ""}`}
            key={shortcut.id}
            onClick={() => handleShortcutClick(shortcut.id)}
            disabled={!canOpen}
          >
            <span className={`desktop-icon-tile ${shortcut.tone}`}>
              <span className="desktop-icon-glyph-wrap">
                <Icon size={30} strokeWidth={2.1} className="desktop-icon-glyph" />
              </span>
            </span>
            <span className="desktop-icon-label">{shortcut.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default DesktopShortcuts;
