import { BatteryFull, Search, Wifi } from "lucide-react";

import { menuItems } from "../data/desktopData";

type MenuBarProps = {
  clock: string;
};

const MenuBar = ({ clock }: MenuBarProps) => {
  return (
    <header className="menu-bar">
      <div className="menu-left">
        <div className="logo" aria-hidden="true">
          <span />
        </div>
        <span className="menu-app-name">David's</span>
        {menuItems.map((item) => (
          <button className="menu-item" key={item} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="menu-right">
        <button type="button" className="menu-icon-button" aria-label="Wi-Fi status">
          <Wifi size={14} strokeWidth={2.2} />
        </button>
        <button type="button" className="menu-icon-button" aria-label="Battery status">
          <BatteryFull size={14} strokeWidth={2.2} />
        </button>
        <button type="button" className="menu-icon-button" aria-label="Search">
          <Search size={14} strokeWidth={2.2} />
        </button>
        <span className="clock-label">{clock}</span>
      </div>
    </header>
  );
};

export default MenuBar;
