import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { FONT_WEIGHTS, HERO_KICKER, HERO_TITLE, ANIMATION_DURATIONS } from "../constants/animations";
import { useTextLetterAnimation } from "../hooks/useAnimations";

/**
 * Split text into individual letter spans for interactive animation
 */
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

  // Use custom hook for text letter animation
  useTextLetterAnimation(kickerRef as React.RefObject<HTMLParagraphElement>, FONT_WEIGHTS.kicker);
  useTextLetterAnimation(titleRef as React.RefObject<HTMLHeadingElement>, FONT_WEIGHTS.title);

  useGSAP(
    () => {
      const { heroKicker, heroTitle, heroActions } = ANIMATION_DURATIONS;

      gsap.from(".hero-kicker", {
        opacity: 0,
        y: 18,
        duration: heroKicker.duration,
        ease: heroKicker.ease,
      });
      gsap.from(".hero-title", {
        opacity: 0,
        y: 20,
        duration: heroTitle.duration,
        delay: heroTitle.delay,
        ease: heroTitle.ease,
      });
      gsap.from(".hero-actions", {
        opacity: 0,
        y: 14,
        duration: heroActions.duration,
        delay: heroActions.delay,
        ease: heroActions.ease,
      });
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
