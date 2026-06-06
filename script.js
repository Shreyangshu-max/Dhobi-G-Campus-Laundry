document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    
    // Hold page scroll steady at launch
    document.body.classList.add('modal-open');

    function triggerCurtainExit() {
        if (!splashScreen.classList.contains('exit-active')) {
            // 1. Kick off the slower 1.2-second CSS movement
            splashScreen.classList.add('exit-active');
            
            // 2. Safely release user scrolling control
            document.body.classList.remove('modal-open');

            // 3. MODIFIED: Adjusted to 1200ms to allow the slower slide to finish beautifully
            setTimeout(() => {
                splashScreen.remove();
            }, 1200); 

            removeTriggers();
        }
    }

    // Input capture triggers
    function handleWheel(e) { if (e.deltaY !== 0) triggerCurtainExit(); }
    function handleTouch() { triggerCurtainExit(); }
    function handleKey(e) { if (['ArrowDown', 'Space', 'PageDown'].includes(e.key)) triggerCurtainExit(); }

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('keydown', handleKey);

    function removeTriggers() {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchmove', handleTouch);
        window.removeEventListener('keydown', handleKey);
    }
});