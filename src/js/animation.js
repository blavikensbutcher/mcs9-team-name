gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.animated').forEach((section, i) => {
  const fromX = i % 2 === 0 ? -225 : 225;
  gsap.fromTo(
    section,
    { x: fromX, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'bottom 15%',
        toggleActions: 'play none none none',
      },
    }
  );
});
