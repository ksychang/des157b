(function () {
    'use strict';

    gsap.registerPlugin(TextPlugin);

    // ─── Poem data ─────────────────────────────────────────────────────────────
    // anim     = animation for dark sections (reading forward, pessimistic)
    // animBack = animation for light sections (reading backward, optimistic)
    const poem = [
        {
            text: 'There is no meaning in life',
            sign: 'neg',
            anim: 'scatter',     // fragments drift in, then dissolve to dim
            animBack: 'illuminate',  // fades in full brightness — recontextualised
        },
        {
            text: 'So you cannot conclude that',
            sign: 'neu',
            anim: 'slide',       // flat left-to-right slide
            animBack: 'slide-right', // slides in from the right — opposite direction
        },
        {
            text: 'I have a purpose on this earth',
            sign: 'pos',
            anim: 'rise',        // words rise from below and anchor
            animBack: 'cascade',     // words fall from above and stack deliberately
        },
        {
            text: 'I choose to believe',
            sign: 'neu',
            anim: 'pulse',       // nervous heartbeat
            animBack: 'bloom',       // slow warm color bloom — settled, not anxious
        },
        {
            text: 'My actions have no impact, but',
            sign: 'neg',
            anim: 'dim-but',     // line fades dim, "but" flickers on
            animBack: 'but-first',   // "but" leads bright, rest follows
        },
        {
            text: 'People try to tell me',
            sign: 'neu',
            anim: 'multidirec',  // words fly in from different directions
            animBack: 'converge',    // words converge inward — they're coming toward you
        },
        {
            text: 'I have so much worth',
            sign: 'pos',
            anim: 'grow',        // scales up from tiny
            animBack: 'burst',       // each word pops outward then snaps back — exclamation
        },
        {
            text: 'I refuse to believe what others tell me because',
            sign: 'neu',
            anim: 'typewriter',  // word-by-word, methodical
            animBack: 'assert',      // whole line slides in as one confident block
        },
        {
            text: 'I know my real value',
            sign: 'both',
            anim: 'glitch',      // glitches, then resolves
            animBack: 'glow-rise',   // words float up glowing — the resolved version
        },
    ];

    // Section index → { poemIndex, isReverse } mapping.
    // 0 = title, 1–8 = dark (forward), 9–17 = light (backward)
    function getSectionData(sectionIndex) {
        if (sectionIndex === 0) return null;
        if (sectionIndex <= 8) return { poemIndex: sectionIndex - 1, isReverse: false };
        return { poemIndex: 17 - sectionIndex, isReverse: true };
    }

    // ─── Helper: split text into word spans ────────────────────────────────────
    function spannify(el, text) {
        el.innerHTML = text
            .split(' ')
            .map(w => `<span class="word">${w}</span>`)
            .join('<span class="gap"> </span>');
        return el.querySelectorAll('.word');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DARK SECTION ANIMATIONS (forward reading — pessimistic)
    // ═══════════════════════════════════════════════════════════════════════════

    function animScatter(el, text) {
        const words = spannify(el, text);
        words.forEach(w => gsap.set(w, {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 40,
            opacity: 0,
        }));
        const tl = gsap.timeline();
        tl.to(words, {
            opacity: 1, x: 0, y: 0,
            duration: 0.7,
            stagger: { each: 0.08, from: 'random' },
            ease: 'power2.out',
        });
        tl.to(words, {
            opacity: 0.28,
            duration: 1.4,
            stagger: { each: 0.1, from: 'end' },
            ease: 'power1.in',
        }, '+=0.2');
        return tl;
    }

    function animSlide(el, text) {
        el.textContent = text;
        return gsap.fromTo(el,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.55, ease: 'power1.out' }
        );
    }

    function animRise(el, text) {
        const words = spannify(el, text);
        return gsap.fromTo(words,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.5)' }
        );
    }

    function animPulse(el, text) {
        el.textContent = text;
        const tl = gsap.timeline();
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' });
        tl.to(el, { scale: 1.06, duration: 0.22, ease: 'power1.out', transformOrigin: 'center' });
        tl.to(el, { scale: 1, duration: 0.18, ease: 'power1.in' });
        tl.to(el, { scale: 1.04, duration: 0.18, ease: 'power1.out' });
        tl.to(el, { scale: 1, duration: 0.15, ease: 'power1.in' });
        return tl;
    }

    function animDimBut(el, text) {
        const words = spannify(el, text);
        const butWord = words[words.length - 1];
        const restWords = Array.from(words).slice(0, -1);
        const tl = gsap.timeline();
        tl.fromTo(restWords,
            { opacity: 0 },
            { opacity: 0.3, duration: 0.6, stagger: 0.07, ease: 'power1.out' }
        );
        tl.fromTo(butWord, { opacity: 0 }, { opacity: 0.3, duration: 0.1 });
        for (let i = 0; i < 4; i++) {
            tl.to(butWord, { opacity: 1, duration: 0.08 });
            tl.to(butWord, { opacity: 0.2, duration: 0.08 });
        }
        tl.to(butWord, { opacity: 1, color: 'hsl(140, 40%, 72%)', duration: 0.3, ease: 'power2.out' });
        return tl;
    }

    function animMultidirec(el, text) {
        const words = spannify(el, text);
        const dirs = [[-50, 0], [0, 35], [50, 0], [-35, -25], [40, 20]];
        words.forEach((w, i) => {
            const d = dirs[i % dirs.length];
            gsap.fromTo(w,
                { opacity: 0, x: d[0], y: d[1] },
                { opacity: 1, x: 0, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power2.out' }
            );
        });
    }

    function animGrow(el, text) {
        const words = spannify(el, text);
        return gsap.fromTo(words,
            { scale: 0.05, opacity: 0, transformOrigin: 'center bottom' },
            { scale: 1, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'back.out(2)' }
        );
    }

    function animTypewriter(el, text) {
        const words = spannify(el, text);
        gsap.set(words, { opacity: 0 });
        words.forEach((w, i) => {
            gsap.to(w, { opacity: 1, duration: 0.01, delay: i * 0.2 });
        });
    }

    function animGlitch(el, text) {
        const words = spannify(el, text);
        const tl = gsap.timeline();
        tl.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        for (let i = 0; i < 7; i++) {
            tl.to(el, {
                x: (i % 2 === 0 ? 5 : -5),
                skewX: (i % 2 === 0 ? 4 : -4),
                duration: 0.05, ease: 'none',
            });
        }
        tl.to(el, { x: 0, skewX: 0, duration: 0.12 });
        tl.to(words, {
            color: 'hsl(255, 55%, 72%)',
            duration: 0.5, stagger: 0.09, ease: 'power2.out',
        });
        return tl;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LIGHT SECTION ANIMATIONS (backward reading — optimistic)
    // ═══════════════════════════════════════════════════════════════════════════

    function animIlluminate(el, text) {
        // "There is no meaning in life" — but now it lands full and bright.
        // The same words, recontextualised. Fades in cleanly, fully opaque.
        el.textContent = text;
        const tl = gsap.timeline();
        tl.fromTo(el,
            { opacity: 0, filter: 'brightness(3)' },
            { opacity: 1, filter: 'brightness(1)', duration: 1.1, ease: 'power2.out' }
        );
        return tl;
    }

    function animSlideRight(el, text) {
        // "So you cannot conclude that" — slides in from the right this time.
        el.textContent = text;
        return gsap.fromTo(el,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.55, ease: 'power1.out' }
        );
    }

    function animCascade(el, text) {
        // "I have a purpose on this earth" — words fall from above and stack,
        // like being placed deliberately, one by one.
        const words = spannify(el, text);
        return gsap.fromTo(words,
            { opacity: 0, y: -45 },
            {
                opacity: 1, y: 0,
                duration: 0.5,
                stagger: 0.09,
                ease: 'bounce.out',
            }
        );
    }

    function animBloom(el, text) {
        // "I choose to believe" — slow warm fade, color blooms in like sunrise.
        // Settled and certain, unlike the nervous pulse going forward.
        const words = spannify(el, text);
        gsap.set(words, { opacity: 0, color: 'hsl(40, 20%, 60%)' });
        const tl = gsap.timeline();
        tl.to(words, {
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power1.inOut',
        });
        tl.to(words, {
            color: 'hsl(40, 80%, 78%)',
            duration: 1.0,
            stagger: 0.15,
            ease: 'power1.out',
        }, '-=0.8');
        return tl;
    }

    function animButFirst(el, text) {
        // "My actions have no impact, but" — "but" leads in bright,
        // then the rest of the line materialises behind it.
        const words = spannify(el, text);
        const butWord = words[words.length - 1];
        const restWords = Array.from(words).slice(0, -1);
        gsap.set(words, { opacity: 0 });
        const tl = gsap.timeline();
        // "but" blazes in first
        tl.to(butWord, {
            opacity: 1, color: 'hsl(140, 60%, 68%)',
            duration: 0.35, ease: 'power2.out',
        });
        // slight pause — then the rest builds behind it
        tl.to(restWords, {
            opacity: 1,
            duration: 0.55,
            stagger: { each: 0.07, from: 'end' },
            ease: 'power1.out',
        }, '+=0.15');
        return tl;
    }

    function animConverge(el, text) {
        // "People try to tell me" — words converge inward from the edges,
        // opposite of the outward multidirectional. They're coming toward you now.
        const words = spannify(el, text);
        const count = words.length;
        words.forEach((w, i) => {
            // Map each word to a position fanning outward, then pull to center
            const spread = (i / (count - 1) - 0.5) * 160;
            gsap.fromTo(w,
                { opacity: 0, x: spread, y: Math.abs(spread) * 0.2 },
                { opacity: 1, x: 0, y: 0, duration: 0.6, delay: 0.05 * i, ease: 'power3.out' }
            );
        });
    }

    function animBurst(el, text) {
        // "I have so much worth" — each word pops outward then snaps back.
        // Like an exclamation, full of energy.
        const words = spannify(el, text);
        gsap.set(words, { opacity: 0 });
        words.forEach((w, i) => {
            const tl = gsap.timeline({ delay: i * 0.13 });
            tl.to(w, { opacity: 1, scale: 1.45, duration: 0.18, ease: 'power2.out', transformOrigin: 'center' });
            tl.to(w, { scale: 1, duration: 0.22, ease: 'back.out(3)' });
        });
    }

    function animAssert(el, text) {
        // "I refuse to believe what others tell me because" — the whole line
        // slides in as one bold block. No hesitation, unlike the typewriter.
        el.textContent = text;
        const tl = gsap.timeline();
        tl.fromTo(el,
            { opacity: 0, x: -40, skewX: -4 },
            { opacity: 1, x: 0, skewX: 0, duration: 0.5, ease: 'power3.out' }
        );
        return tl;
    }

    function animGlowRise(el, text) {
        // "I know my real value" — the resolved version of the glitch.
        // Words float up softly, glowing as they land. Certain.
        const words = spannify(el, text);
        gsap.set(words, { opacity: 0, y: 30, color: 'hsl(255, 30%, 50%)' });
        const tl = gsap.timeline();
        tl.to(words, {
            opacity: 1, y: 0,
            color: 'hsl(355, 61%, 46%)',
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
        });
        // Gentle final pulse — settled
        tl.to(el, { scale: 1.03, duration: 0.3, ease: 'power1.inOut', transformOrigin: 'center' });
        tl.to(el, { scale: 1, duration: 0.3, ease: 'power1.inOut' });
        return tl;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HOVER INTERACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    // Tracks currently active hover tweens so we can kill them cleanly on leave
    const hoverState = new WeakMap();

    function attachHover(h2, sign) {
        // Remove any previous listeners by cloning the node
        const fresh = h2.cloneNode(true);
        h2.parentNode.replaceChild(fresh, h2);

        if (sign === 'pos') return fresh; // positive lines are solid — no hover

        if (sign === 'neg') {
            // ── Unravel: words drift apart on enter, snap back on leave ──────
            fresh.addEventListener('mouseenter', () => {
                const words = fresh.querySelectorAll('.word');
                if (!words.length) return;
                const tl = gsap.timeline();
                words.forEach(w => {
                    tl.to(w, {
                        x: (Math.random() - 0.5) * 55,
                        y: (Math.random() - 0.5) * 25,
                        opacity: 0.35,
                        duration: 0.55,
                        ease: 'power2.out',
                    }, 0); // all start at same time (position label 0)
                });
                hoverState.set(fresh, tl);
            });

            fresh.addEventListener('mouseleave', () => {
                const prev = hoverState.get(fresh);
                if (prev) prev.kill();
                const words = fresh.querySelectorAll('.word');
                gsap.to(words, {
                    x: 0, y: 0, opacity: 1,
                    duration: 0.4,
                    stagger: 0.04,
                    ease: 'back.out(1.8)',
                });
            });
        }

        if (sign === 'neu') {
            // ── Echo: a ghost of the line appears behind it on hover ─────────
            // Create the ghost element once and reuse it
            let ghost = fresh.parentNode.querySelector('.echo-ghost');
            if (!ghost) {
                ghost = document.createElement('h2');
                ghost.className = 'echo-ghost';
                // Mirror the h2's styles but ghosted — position behind it
                ghost.style.cssText = `
                    position: absolute;
                    z-index: 0;
                    top: 40vmin;
                    width: 100vmax;
                    text-align: center;
                    left: 0;
                    opacity: 0;
                    pointer-events: none;
                    filter: blur(1.5px);
                    transform: translate(6px, 5px);
                `;
                fresh.parentNode.appendChild(ghost);
            }

            fresh.addEventListener('mouseenter', () => {
                // Copy current text into ghost
                ghost.textContent = fresh.textContent;
                const tl = gsap.timeline();
                tl.to(ghost, {
                    opacity: 0.18,
                    duration: 0.5,
                    ease: 'power1.out',
                });
                // Subtle shimmer on the main line
                tl.to(fresh, {
                    opacity: 0.75,
                    duration: 0.3,
                    ease: 'power1.out',
                }, 0);
                hoverState.set(fresh, tl);
            });

            fresh.addEventListener('mouseleave', () => {
                const prev = hoverState.get(fresh);
                if (prev) prev.kill();
                gsap.to(ghost, { opacity: 0, duration: 0.35, ease: 'power1.in' });
                gsap.to(fresh, { opacity: 1, duration: 0.3, ease: 'power1.out' });
            });
        }

        if (sign === 'both') {
            // ── Pivot: gets both echo AND a subtle unravel ───────────────────
            let ghost = fresh.parentNode.querySelector('.echo-ghost');
            if (!ghost) {
                ghost = document.createElement('h2');
                ghost.className = 'echo-ghost';
                ghost.style.cssText = `
                    position: absolute;
                    z-index: 0;
                    top: 40vmin;
                    width: 100vmax;
                    text-align: center;
                    left: 0;
                    opacity: 0;
                    pointer-events: none;
                    filter: blur(2px);
                    transform: translate(8px, 6px);
                `;
                fresh.parentNode.appendChild(ghost);
            }

            fresh.addEventListener('mouseenter', () => {
                const words = fresh.querySelectorAll('.word');
                ghost.textContent = fresh.textContent;

                const tl = gsap.timeline();
                // Echo appears
                tl.to(ghost, { opacity: 0.2, duration: 0.45, ease: 'power1.out' }, 0);
                // Words drift slightly — tension, not full unravel
                if (words.length) {
                    words.forEach(w => {
                        tl.to(w, {
                            x: (Math.random() - 0.5) * 20,
                            y: (Math.random() - 0.5) * 10,
                            duration: 0.6,
                            ease: 'power1.inOut',
                        }, 0);
                    });
                }
                hoverState.set(fresh, tl);
            });

            fresh.addEventListener('mouseleave', () => {
                const prev = hoverState.get(fresh);
                if (prev) prev.kill();
                const words = fresh.querySelectorAll('.word');
                gsap.to(ghost, { opacity: 0, duration: 0.35, ease: 'power1.in' });
                if (words.length) {
                    gsap.to(words, {
                        x: 0, y: 0,
                        duration: 0.4,
                        stagger: 0.03,
                        ease: 'back.out(2)',
                    });
                }
            });
        }

        return fresh;
    }

    // ─── Title animation ────────────────────────────────────────────────────────
    function animTitle() {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo('#lost',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
        tl.fromTo('#generation',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.4'
        );
        tl.fromTo('#author',
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: 'power1.out' },
            '-=0.2'
        );
        return tl;
    }

    // ─── Dispatcher ─────────────────────────────────────────────────────────────
    function runAnimation(el, entry, isReverse) {
        gsap.set(el, { clearProps: 'all' });
        el.innerHTML = '';

        const key = isReverse ? entry.animBack : entry.anim;

        switch (key) {
            // Dark (forward)
            case 'scatter': animScatter(el, entry.text); break;
            case 'slide': animSlide(el, entry.text); break;
            case 'rise': animRise(el, entry.text); break;
            case 'pulse': animPulse(el, entry.text); break;
            case 'dim-but': animDimBut(el, entry.text); break;
            case 'multidirec': animMultidirec(el, entry.text); break;
            case 'grow': animGrow(el, entry.text); break;
            case 'typewriter': animTypewriter(el, entry.text); break;
            case 'glitch': animGlitch(el, entry.text); break;
            // Light (backward)
            case 'illuminate': animIlluminate(el, entry.text); break;
            case 'slide-right': animSlideRight(el, entry.text); break;
            case 'cascade': animCascade(el, entry.text); break;
            case 'bloom': animBloom(el, entry.text); break;
            case 'but-first': animButFirst(el, entry.text); break;
            case 'converge': animConverge(el, entry.text); break;
            case 'burst': animBurst(el, entry.text); break;
            case 'assert': animAssert(el, entry.text); break;
            case 'glow-rise': animGlowRise(el, entry.text); break;
        }
    }

    // ─── fullPage.js init ───────────────────────────────────────────────────────
    var myFullpage = new fullpage('#fullpage', {
        lockAnchors: false,
        navigation: false,
        slidesNavigation: false,

        css3: true,
        scrollingSpeed: 700,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 600,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        continuousVertical: true,
        scrollOverflow: true,
        touchSensitivity: 15,

        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        verticalCentered: true,
        paddingTop: '3em',
        paddingBottom: '10px',

        sectionSelector: '.section',
        slideSelector: '.slide',

        lazyLoading: true,
        observer: true,
        credits: { enabled: true, label: 'Made with fullPage.js', position: 'right' },

        afterLoad: function (origin, destination, direction, trigger) {
            const sectionIndex = destination.index;
            const data = getSectionData(sectionIndex);

            if (data === null) {
                animTitle();
                return;
            }

            const entry = poem[data.poemIndex];
            const h2 = destination.item.querySelector('h2');
            if (!h2) return;

            runAnimation(h2, entry, data.isReverse);

            // Attach hover interactions after a short delay so the entrance
            // animation finishes before hover listeners go live.
            // Typewriter is slower so gets a longer grace period.
            const delay = entry.anim === 'typewriter' ? 2200 : 900;
            setTimeout(() => {
                attachHover(destination.item.querySelector('h2'), entry.sign);
            }, delay);
        },

        beforeLeave: function (origin, destination, direction, trigger) { },
        onLeave: function (origin, destination, direction, trigger) { },
        afterRender: function () { animTitle(); },
        afterResize: function (width, height) { },
        afterReBuild: function () { },
        afterResponsive: function (isResponsive) { },
        afterSlideLoad: function (section, origin, destination, direction, trigger) { },
        onSlideLeave: function (section, origin, destination, direction, trigger) { },
        onScrollOverflow: function (section, slide, position, direction) { },
    });

})();