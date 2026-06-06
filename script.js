document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const video = document.getElementById('laundry-video');
    
    // Hold page scroll steady at launch
    document.body.classList.add('modal-open');

    if (video) {
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.load(); 
    }

    // =========================================================================
    // 1. TEXT SPLITTING UTILITY FOR CHARACTER-BY-CHARACTER COLOR REVEALS
    // =========================================================================
    const quoteElement = document.getElementById('scroll-reveal-text');
    if (quoteElement) {
        const textContent = quoteElement.textContent.trim();
        quoteElement.innerHTML = ''; 

        Array.from(textContent).forEach(char => {
            const span = document.createElement('span');
            span.className = 'char-span';
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            quoteElement.appendChild(span);
        });
    }

    // =========================================================================
    // 2. VIDEO TIMELINE LOOP STOPPER
    // =========================================================================
    if (video) {
        video.addEventListener('ended', () => {
            video.pause();
            video.currentTime = video.duration - 0.05; 
        });
    }

    // =========================================================================
    // 3. SINGLE GRAPHICS ENGINE (HERO TRANSITION & COLOR CHANGE SPLICE)
    // =========================================================================
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        const logoHeader = document.getElementById('main-brand-logo');
        const navStrip = document.getElementById('black-navbar-strip');

        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "+=120vh",       // Standard, snappy page-turning scroll length
                scrub: 1,             
                pin: "#hero-canvas",   
                anticipatePin: 1,
                onUpdate: (self) => {
                    if (navStrip) {
                        if (self.progress > 0.12) {
                            navStrip.classList.add('is-active');
                        } else {
                            navStrip.classList.remove('is-active');
                        }
                    }
                }
            }
        });

        // Everything triggers in perfect harmony right here
        scrollTimeline
            // 1. Blur and fade away the hero assets
            .to("#hero-canvas .middle-strip, #hero-canvas .right-edge-tagline, #hero-canvas .bottom-left-tech", {
                scale: 0.65,
                transformOrigin: "center center",
                opacity: 0,
                filter: "blur(10px)",
                duration: 1
            }, 0)
            
            // 2. Shrink down the primary viewport header logo layout
            .to(logoHeader, {
                scale: 0.22,       
                opacity: 0.5,               
                duration: 1,
                ease: "none"
            }, 0)
            
            // 3. Roll up the quotation page layout from the bottom floor edge
            .to("#before-section", {
                yPercent: -100,
                ease: "none",
                duration: 1
            }, 0.1)

            // 4. INSTANT COLOR CHANGE: Starts turning blue right as the hero section fades out
            .to(".char-span", {
                color: "#007bb5",
                stagger: 0.02,        // Quick, sequential character flash reveal
                ease: "none",
                duration: 0.8
            }, 0.1); 
    }

    // =========================================================================
    // 4. SYNCED INTRO SEQUENCE
    // =========================================================================
    function triggerIntroSequence() {
        if (!splashScreen || splashScreen.hasAttribute('data-animated')) return;
        splashScreen.setAttribute('data-animated', 'true');

        if (video) {
            video.play().catch(err => console.log("Video engine wake-up paused:", err));
        }

        const introTl = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('modal-open'); 
                initScrollAnimations();                        
                splashScreen.remove();                         
            }
        });

        introTl
            .to(splashScreen, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            }, 0)
            
            .fromTo("#main-brand-logo, #hero-canvas .cascade-item", 
                { 
                    opacity: 0, 
                    scale: 0.88, 
                    filter: "blur(10px)" 
                },
                { 
                    opacity: 1, 
                    scale: 1, 
                    filter: "blur(0px)", 
                    stagger: 0.08, 
                    duration: 1.4, 
                    ease: "power3.out",
                    onStart: () => {
                        if (video && video.paused) {
                            video.play().catch(e => console.log("Bypassing browser block:", e));
                        }
                    }
                }, 
                0.2
            );

        removeTriggers();
    }

    const autoExitTimeout = setTimeout(triggerIntroSequence, 1500);

    function handleWheel(e) { if (e.deltaY !== 0) triggerIntroSequence(); }
    function handleTouch() { triggerIntroSequence(); }
    function handleKey(e) { if (['ArrowDown', 'Space', 'PageDown'].includes(e.key)) triggerIntroSequence(); }

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('keydown', handleKey);

    function removeTriggers() {
        clearTimeout(autoExitTimeout); 
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchmove', handleTouch);
        window.removeEventListener('keydown', handleKey);
    }
});