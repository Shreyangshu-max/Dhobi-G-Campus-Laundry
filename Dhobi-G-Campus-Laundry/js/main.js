/* ============================================================
   MAIN.JS — Splash screen + cascade animations
   Dhobi G Campus Laundry
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');

    // Hold page scroll steady at launch
    document.body.classList.add('modal-open');

    function triggerCurtainExit() {
        if (!splashScreen.classList.contains('exit-active')) {
            splashScreen.classList.add('exit-active');
            document.body.classList.remove('modal-open');
            setTimeout(() => splashScreen.remove(), 1200);
            removeTriggers();
        }
    }

    function handleWheel(e) { if (e.deltaY !== 0) triggerCurtainExit(); }
    function handleTouch()  { triggerCurtainExit(); }
    function handleKey(e)   { if (['ArrowDown', 'Space', 'PageDown'].includes(e.key)) triggerCurtainExit(); }

    window.addEventListener('wheel',     handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('keydown',   handleKey);

    function removeTriggers() {
        window.removeEventListener('wheel',     handleWheel);
        window.removeEventListener('touchmove', handleTouch);
        window.removeEventListener('keydown',   handleKey);
    }
});
