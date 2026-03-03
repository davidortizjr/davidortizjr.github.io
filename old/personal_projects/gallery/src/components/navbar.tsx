export function Navbar() {
    return (
        <header className="sticky top-0 p-4 flex items-center">
            <div className="container mx-auto flex items-center">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-[var(--clr-teal)]">favorite</span>
                    <h2 className="text-2xl font-bold text-slate-800"> memory lane</h2>
                </div>
            </div>
        </header>
    );
}