/* ============================================================
   MAIN.JS - Application entry point
   Dhobi G Campus Laundry
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const app = window.DhobiG || {};

    app.ProcessReveal?.prepare();
    app.HeroIntro?.init();
    app.ServicesAccordion?.init();
});
