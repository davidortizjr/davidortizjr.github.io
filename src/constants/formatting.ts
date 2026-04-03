export const APPLE_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
});

export const FINDER_VIEW_MODE_STORAGE_KEY = "mac-portfolio-finder-view-mode";
export const CLOCK_UPDATE_INTERVAL = 1000 * 15; // 15 seconds
