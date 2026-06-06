/* ============================================================
   UI.JS — Services sticky stack + nav indicator
   Dhobi G Campus Laundry
   ============================================================ */

(function initServicesStack() {
    const section = document.querySelector(".services-section");
    const cards = Array.from(document.querySelectorAll(".service-row[data-name]"));
    const navNum = document.getElementById("nav-svc-num");
    const navName = document.getElementById("nav-svc-name");

    if (!section || !cards.length) return;

    let ticking = false;
    let viewportHeight = window.innerHeight;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    cards.forEach((card, index) => {
        card.style.setProperty("--card-index", index);
        card.style.setProperty("--card-z", index + 2);
        card.style.setProperty("--stack-offset", `${index * 18}px`);
        card.style.setProperty("--card-scale", 1);
        card.style.setProperty("--card-y", "0px");
        card.style.setProperty("--card-opacity", 1);
    });

    function setNav(activeCard, isVisible) {
        if (!navNum || !navName) return;

        if (!activeCard || !isVisible) {
            navNum.classList.remove("visible");
            navName.classList.remove("visible");
            navNum.textContent = "";
            navName.textContent = "";
            return;
        }

        navNum.textContent = activeCard.dataset.num || "";
        navName.textContent = activeCard.dataset.name || "";
        navNum.classList.add("visible");
        navName.classList.add("visible");
    }

    function updateStackCards() {
        ticking = false;

        const sectionRect = section.getBoundingClientRect();
        const sectionVisible = sectionRect.top < viewportHeight && sectionRect.bottom > 0;
        const measurements = cards.map((card) => {
            const rect = card.getBoundingClientRect();
            return {
                card,
                top: rect.top,
                height: rect.height
            };
        });

        let activeIndex = -1;
        const activeLine = viewportHeight * 0.52;

        measurements.forEach((measurement, index) => {
            if (measurement.top <= activeLine) {
                activeIndex = index;
            }
        });

        measurements.forEach((measurement, index) => {
            const next = measurements[index + 1];
            const coverStart = viewportHeight * 0.78;
            const coverEnd = 108 + index * 18;
            const coverProgress = next
                ? clamp((coverStart - next.top) / Math.max(coverStart - coverEnd, 1), 0, 1)
                : 0;

            const scale = 1 - coverProgress * 0.045;
            const y = -coverProgress * 24;
            const opacity = 1 - coverProgress * 0.14;

            measurement.card.style.setProperty("--card-scale", scale.toFixed(3));
            measurement.card.style.setProperty("--card-y", `${y.toFixed(1)}px`);
            measurement.card.style.setProperty("--card-opacity", opacity.toFixed(3));
            measurement.card.classList.toggle("is-passed", coverProgress > 0.58);
            measurement.card.classList.toggle("is-current", index === activeIndex);
        });

        setNav(cards[activeIndex], sectionVisible && activeIndex >= 0);
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateStackCards);
    }

    function handleResize() {
        viewportHeight = window.innerHeight;
        requestUpdate();
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    requestUpdate();
})();
