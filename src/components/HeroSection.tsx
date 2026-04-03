import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const HERO_KICKER = "Hey, I'm David! Welcome to my";
const HERO_TITLE = "portfolio";

const FONT_WEIGHTS = {
  kicker: { min: 420, max: 700, default: 430 },
  title: { min: 420, max: 760, default: 420 },
} as const;

const splitLetters = (text: string) => {
  return text.split("").map((char, index) => {
    const value = char === " " ? "\u00A0" : char;
    return (
      <span key={`${char}-${index}`} className="hero-letter">
        {value}
      </span>
    );
  });
};

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-kicker", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(".hero-title", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.1,
        ease: "power3.out",
      });
      gsap.from(".hero-actions", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        delay: 0.25,
        ease: "power2.out",
      });

      const setupTextHover = (
        container: HTMLParagraphElement | HTMLHeadingElement | null,
        type: keyof typeof FONT_WEIGHTS
      ) => {
        if (!container) {
          return () => {};
        }

        const letters = container.querySelectorAll<HTMLElement>("span");
        const { min, max, default: base } = FONT_WEIGHTS[type];

        const animateLetter = (letter: HTMLElement, weight: number, duration = 0.25) => {
          return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
            fontWeight: weight,
          });
        };

        letters.forEach((letter) => {
          animateLetter(letter, base, 0);
        });

        const handleMouseMove = (event: MouseEvent) => {
          const { left } = container.getBoundingClientRect();
          const mouseX = event.clientX - left;

          letters.forEach((letter) => {
            const { left: letterLeft, width } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (letterLeft - left + width / 2));
            const intensity = Math.exp(-(distance ** 2) / 2000);
            const weight = Math.round(min + (max - min) * intensity);

            animateLetter(letter, weight);
          });
        };

        const handleMouseLeave = () => {
          letters.forEach((letter) => {
            animateLetter(letter, base, 0.3);
          });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);
        };
      };

      const cleanupKicker = setupTextHover(kickerRef.current, "kicker");
      const cleanupTitle = setupTextHover(titleRef.current, "title");

      return () => {
        cleanupKicker();
        cleanupTitle();
      };
    },
    { scope: heroRef }
  );

  return (
    <section className="hero-section" ref={heroRef} aria-label="Portfolio hero section">
      <p className="hero-kicker" ref={kickerRef}>{splitLetters(HERO_KICKER)}</p>
      <h1 className="hero-title" ref={titleRef}>{splitLetters(HERO_TITLE)}</h1>
    </section>
  );
};

export default HeroSection;
