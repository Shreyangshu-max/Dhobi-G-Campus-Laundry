/* ============================================================
   HERO INTRO MODULE
   Splash, video start, and GSAP hero-to-process transition.
   ============================================================ */

(function registerHeroIntro(global) {
    const namespace = global.DhobiG || (global.DhobiG = {});

    const init = () => {
        const splashScreen = document.getElementById("splash-screen");
        const video = document.getElementById("laundry-video");
        const logoHeader = document.getElementById("main-brand-logo");

        document.body.classList.add("modal-open");

        if (video) {
            video.muted = true;
            video.playsInline = true;
            video.preload = "auto";
            video.load();

            video.addEventListener("ended", () => {
                video.pause();
                video.currentTime = Math.max(video.duration - 0.05, 0);
            });
        }

        const showHeroWithoutGsap = () => {
            document.body.classList.remove("modal-open");
            if (splashScreen) splashScreen.remove();
            if (logoHeader) logoHeader.style.opacity = 1;

            document.querySelectorAll(".cascade-item").forEach((item) => {
                item.style.opacity = 1;
                item.style.filter = "none";
                item.style.transform = "none";
            });

        };

        const initScrollAnimations = () => {
            if (!global.gsap || !global.ScrollTrigger) {
                showHeroWithoutGsap();
                return;
            }

            gsap.registerPlugin(ScrollTrigger);

            const scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "top top",
                    end: "+=120vh",
                    scrub: 1,
                    pin: "#hero-canvas",
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        if (!logoHeader) return;
                        logoHeader.classList.toggle("is-nav-visible", self.progress > 0.12);
                    }
                }
            });

            scrollTimeline
                .to("#hero-canvas .middle-strip, #hero-canvas .right-edge-tagline, #hero-canvas .bottom-left-tech", {
                    scale: 0.65,
                    transformOrigin: "center center",
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 1
                }, 0)
                .to(logoHeader, {
                    scale: 0.22,
                    opacity: 0.5,
                    duration: 1,
                    ease: "none"
                }, 0)
                .fromTo("#before-section", {
                    yPercent: 0
                }, {
                    yPercent: -100,
                    ease: "none",
                    duration: 1
                }, 0.1);

            namespace.ProcessReveal?.addToTimeline(scrollTimeline, 0.1);
            ScrollTrigger.refresh();
        };

        const triggerIntroSequence = () => {
            if (!splashScreen || splashScreen.hasAttribute("data-animated")) return;
            splashScreen.setAttribute("data-animated", "true");

            if (video) video.play().catch(() => {});

            if (!global.gsap) {
                showHeroWithoutGsap();
                removeTriggers();
                return;
            }

            gsap.timeline({
                onComplete: () => {
                    document.body.classList.remove("modal-open");
                    initScrollAnimations();
                    splashScreen.remove();
                }
            })
                .to(splashScreen, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, 0)
                .fromTo("#main-brand-logo, #hero-canvas .cascade-item", {
                    opacity: 0,
                    scale: 0.88,
                    filter: "blur(10px)"
                }, {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    stagger: 0.08,
                    duration: 1.4,
                    ease: "power3.out",
                    onStart: () => {
                        if (video && video.paused) video.play().catch(() => {});
                    }
                }, 0.2);

            removeTriggers();
        };

        const autoExitTimeout = global.setTimeout(triggerIntroSequence, 1500);

        const handleWheel = (event) => {
            if (event.deltaY !== 0) triggerIntroSequence();
        };
        const handleTouch = () => triggerIntroSequence();
        const handleKey = (event) => {
            if (["ArrowDown", "Space", "PageDown"].includes(event.key)) triggerIntroSequence();
        };

        global.addEventListener("wheel", handleWheel, { passive: true });
        global.addEventListener("touchmove", handleTouch, { passive: true });
        global.addEventListener("keydown", handleKey);

        function removeTriggers() {
            global.clearTimeout(autoExitTimeout);
            global.removeEventListener("wheel", handleWheel);
            global.removeEventListener("touchmove", handleTouch);
            global.removeEventListener("keydown", handleKey);
        }
    };

    namespace.HeroIntro = { init };
})(window);
