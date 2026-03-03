import { Gallery } from "./gallery"

export function MainContent() {
    return (
        <section className="relative py-20 px-6 overflow-hidden bg-[var(--clr-green)]">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-2">
                <h2 className="text-4xl font-bold font-handwritten text-slate-800 gap-3">
                    Our Favorite Pages
                    <span className="material-symbols-outlined text-[var(--clr-teal)] animate-bounce ms-3">rocket_launch</span>
                </h2>
                <p className="text-slate-600 text-xl font-script leading-relaxed">
                    A cozy little corner for our laughs, trips, and all the "remember whens" we've shared so far.
                </p>
            </div>
            <div className="max-w-[1400px] mx-auto mt-12">
                <Gallery />
            </div>
        </section>
    )
}