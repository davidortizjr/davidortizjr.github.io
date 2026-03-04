const images = [
    "src/assets/img/pic_2.jpg",
    "src/assets/img/pic_3.jpg",
    "src/assets/img/pic_4.jpg",
    "src/assets/img/pic_5.jpg",
    "src/assets/img/pic_6.jpg",
    "src/assets/img/pic_7.jpg",
    "src/assets/img/pic_8.jpg",
    "src/assets/img/pic_9.jpg",
    "src/assets/img/pic_10.jpg",
    "src/assets/img/pic_11.jpg",
    "src/assets/img/pic_12.jpg",
    "src/assets/img/pic_13.jpg",
    "src/assets/img/pic_14.jpg",
    "src/assets/img/pic_15.jpg",
    "src/assets/img/pic_16.jpg",
    "src/assets/img/pic_17.jpg",
    "src/assets/img/pic_18.jpg",
    "src/assets/img/pic_19.jpg",
    "src/assets/img/pic_20.jpg",
    "src/assets/img/pic_21.jpg",
    "src/assets/img/pic_22.jpg",
    "src/assets/img/pic_23.jpg",
    "src/assets/img/pic_24.jpg",
    "src/assets/img/pic_25.jpg"]

const tapeColors = [
    "var(--clr-pink)",
    "var(--clr-teal)",
    "var(--clr-yellow)",
    "var(--clr-peach)",
    "var(--clr-blue)"
];

const tapePositions = [
    "left-4, rotate-3",
    "right-4 -rotate-3",
    "left-4 -translate-y-1/2 rotate-6",
    "right-4 -translate-y-1/2 -rotate-6",
    "left-4 -translate-y-full rotate-12",
    "right-4 -translate-y-full -rotate-12"
];

export function Gallery() {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-12 py-8">
            {images.slice(1).map((src, index) => (
                <div key={index} className="relative group inline-block w-80">
                    <div className="frame shadow-lg border border-slate-100 transition-transform transform group-hover:scale-105">
                        <div className={`tape ${tapePositions[index % tapePositions.length]}`} style={{ backgroundColor: tapeColors[index % tapeColors.length] }}></div>
                        <img src={src} alt={`Gallery Image ${index + 2}`} className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                    </div>
                </div>
            ))}

        </div>
    )
}