/* ============================================================
   SERVICES ACCORDION MODULE
   Existing services scroll accordion.
   ============================================================ */

(function registerServicesAccordion(global) {
    const namespace = global.DhobiG || (global.DhobiG = {});

    const init = () => {
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
            const activationLine = global.innerHeight * 0.42;
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
            if (ticking) return;
            global.requestAnimationFrame(updateActiveByScroll);
            ticking = true;
        };

        serviceRows.forEach((row) => {
            row.removeAttribute("tabindex");
            row.addEventListener("click", () => openRow(row));
        });

        global.addEventListener("scroll", requestScrollUpdate, { passive: true });
        global.addEventListener("resize", requestScrollUpdate);

        openRow(serviceRows[0]);
        updateActiveByScroll();
    };

    namespace.ServicesAccordion = { init };
})(window);
