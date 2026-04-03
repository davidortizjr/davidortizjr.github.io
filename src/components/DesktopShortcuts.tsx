import { desktopIcons } from "../data/desktopData";

const DesktopShortcuts = () => {
  return (
    <aside className="desktop-shortcuts">
      {desktopIcons.map((shortcut) => {
        const Icon = shortcut.icon;
        return (
          <button type="button" className="desktop-icon" key={shortcut.id}>
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
