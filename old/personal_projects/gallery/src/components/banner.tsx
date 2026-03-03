export function Banner() {
    return (
        <section className="relative py-20 px-6 overflow-hidden bg-[var(--clr-peach)]">
            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex flex-col gap-6 text-left max-w-xl z-10 relative">
                    <div className="doodle-float -top-10 -left-10 transform -rotate-12 text-[var(--clr-teal)] opacity-40">
                        <span className="material-symbols-outlined !text-6xl pb-10">draw</span>
                    </div>
                    <span className="bg-[var(--clr-teal)]/10 text-[var(--clr-teal)] px-4 py-1 rounded-full w-fit font-bold text-lg">SINCE 2022</span>
                    <h1 className="text-slate-800 text-5xl md:text-7xl font-bold leading-[1.1]">
                        Making memories <br /><span className="text-primary-teal">together...</span>
                    </h1>
                    <p className="text-slate-600 text-xl font-script leading-relaxed">
                        A cozy little corner for our laughs, trips, and all the "remember whens" we've shared so far.
                    </p>
                </div>
                <div className="relative w-full max-w-md h-[450px] mt-10 lg:mt-0">
                    <div className="frame absolute inset-0 transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                        <div className="tape bg-[var(--clr-blue)] -top-4 left-1/2 -translate-x-1/2 rotate-3"></div>
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("src/assets/img/pic_1.jpg")' }}></div>
                        <p className="absolute bottom-2 left-0 w-full text-center text-xl text-slate-700">Us in 2026! ❤️</p>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto px-6 py-20 relative">
                    <span className="material-symbols-outlined doodle-float top-40 -left-20 text-[var(--clr-teal)] text-6xl rotate-45">star</span>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6"></div>
                </div>
            </div>
        </section>
    )
}