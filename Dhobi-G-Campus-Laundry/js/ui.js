/* ============================================================
   UI.JS - Services scroll accordion
   Dhobi G Campus Laundry
   ============================================================ */

(function initServicesAccordion() {
    const serviceRows = Array.from(document.querySelectorAll(".service-row"));
    const navNum = document.getElementById("nav-svc-num");
    const navName = document.getElementById("nav-svc-name");

    if (!serviceRows.length) return;

    let activeRow = null;
    let ticking = false;

    const setNav = (row) => {
        if (!navNum || !navName || !row) return;

        navNum.textContent = row.dataset.num || "";
        navName.textContent = row.dataset.name || "";

        navNum.classList.add("visible");
        navName.classList.add("visible");
    };

    const openRow = (nextRow) => {
        if (!nextRow || nextRow === activeRow) return;

        serviceRows.forEach((row) => row.classList.remove("is-active"));
        nextRow.classList.add("is-active");

        activeRow = nextRow;
        setNav(nextRow);
    };

    const updateActiveByScroll = () => {
        /*
          Activation line:
          The row closest to this invisible line becomes active.
          0.42 = slightly above center, like Nakula-style scrolling.
        */
        const activationLine = window.innerHeight * 0.42;

        let closestRow = serviceRows[0];
        let closestDistance = Infinity;

        serviceRows.forEach((row) => {
            const rect = row.getBoundingClientRect();
            const distance = Math.abs(rect.top - activationLine);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestRow = row;
            }
        });

        openRow(closestRow);
        ticking = false;
    };

    const requestScrollUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveByScroll);
            ticking = true;
        }
    };

    serviceRows.forEach((row) => {
        row.removeAttribute("tabindex");

        row.addEventListener("click", () => {
            openRow(row);
        });
    });

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);

    openRow(serviceRows[0]);
    updateActiveByScroll();
})();
/* ============================================================
   PROCESS SECTION — Before text reveal
   ============================================================ */

(function initProcessReveal() {
    const quoteElement = document.getElementById("scroll-reveal-text");

    if (!quoteElement) return;

    const textContent = quoteElement.textContent.trim();
    quoteElement.innerHTML = "";

    Array.from(textContent).forEach((char) => {
        const span = document.createElement("span");
        span.className = "char-span";
        span.innerHTML = char === " " ? "&nbsp;" : char;
        quoteElement.appendChild(span);
    });

    const chars = Array.from(quoteElement.querySelectorAll(".char-span"));

    const updateReveal = () => {
        const rect = quoteElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progress = Math.min(
            1,
            Math.max(0, (windowHeight * 0.78 - rect.top) / (windowHeight * 0.7))
        );

        const activeCount = Math.floor(progress * chars.length);

        chars.forEach((char, index) => {
            char.style.color =
                index < activeCount
                    ? "#007BB5"
                    : "rgba(255, 255, 255, 0.14)";
        });
    };

    window.addEventListener("scroll", () => {
        requestAnimationFrame(updateReveal);
    }, { passive: true });

    window.addEventListener("resize", updateReveal);
    window.addEventListener("load", updateReveal);

    updateReveal();
})();