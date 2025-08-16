gsap.registerPlugin(ScrollTrigger);document.querySelectorAll(".animated").forEach((o,r)=>{const e=r%2===0?-225:225;gsap.fromTo(o,{x:e,opacity:0},{x:0,opacity:1,duration:1.4,ease:"power2.out",scrollTrigger:{trigger:o,start:"top 90%",end:"bottom 15%",toggleActions:"play none none none"}})});
//# sourceMappingURL=animation-BelPy9LG.js.map
