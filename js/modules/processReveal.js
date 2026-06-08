/* ============================================================
   PROCESS REVEAL MODULE
   Splits and animates the before-section quote.
   ============================================================ */

(function registerProcessReveal(global) {
    const namespace = global.DhobiG || (global.DhobiG = {});

    let quoteElement = null;
    let chars = [];

    const prepare = () => {
        quoteElement = document.getElementById("scroll-reveal-text");

        if (!quoteElement || quoteElement.dataset.split === "true") {
            chars = quoteElement ? Array.from(quoteElement.querySelectorAll(".char-span")) : [];
            return;
        }

        const textContent = quoteElement.textContent.trim();
        quoteElement.innerHTML = "";
        quoteElement.dataset.split = "true";

        textContent.split(/\s+/).forEach((word, wordIndex, words) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "word-span";

            Array.from(word).forEach((char) => {
                const charSpan = document.createElement("span");
                charSpan.className = "char-span";
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
            });

            quoteElement.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                quoteElement.appendChild(document.createTextNode(" "));
            }
        });

        chars = Array.from(quoteElement.querySelectorAll(".char-span"));
    };

    const addToTimeline = (timeline, position = 0.1) => {
        if (!timeline || !chars.length || !global.gsap) return;
        gsap.set(chars, { color: "#2a2a2a" });
        timeline.to(chars, {
            color: "#007BB5",
            stagger: 0.02,
            ease: "none",
            duration: 0.8
        }, position);
    };

    namespace.ProcessReveal = {
        prepare,
        addToTimeline
    };
})(window);
