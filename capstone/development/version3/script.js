(function () {
    'use strict';

    gsap.registerPlugin(TextPlugin);

    // ─── Poem data ───────────────────────────────────────────────────────────────
    const poem = [
        { text: 'There is no *meaning* in life', sign: 'neg' },
        { text: 'So I cannot conclude that', sign: 'neu' },
        { text: 'I have a *purpose* on this earth', sign: 'pos' },
        { text: 'I *choose* to believe', sign: 'neu' },
        { text: 'My actions have no impact, *but*', sign: 'neg' },
        { text: 'People try to tell me', sign: 'neu' },
        { text: 'I have *so* *much* *worth*', sign: 'pos' },
        { text: 'I *refuse* to believe what others tell me because', sign: 'neu' },
        { text: 'I know my *real* *value*', sign: 'both' },
    ];

    // 0=title, 1–8=dark, 9–17=light, 18=reflect
    function getSectionData(idx) {
        if (idx === 0 || idx === 18) return null;
        if (idx <= 8) return { poemIndex: idx - 1, isReverse: false };
        return { poemIndex: 17 - idx, isReverse: true };
    }

    // ─── Helper ──────────────────────────────────────────────────────────────────
    function spannify(el, text) {
        // el.innerHTML = text
        //     .split(' ')
        //     .map(w => `<span class="word">${w}</span>`)
        //     .join('<span class="gap"> </span>');
        // return el.querySelectorAll('.word');

        el.innerHTML = text
            .split(' ')
            .map(word => {
                const emphasized =
                    word.startsWith('*') && word.endsWith('*');

                word = word.replace(/\*/g, '');

                return emphasized
                    ? `<span class="word emphasis">${word}</span>`
                    : `<span class="word">${word}</span>`;
            })
            .join('<span class="gap"> </span>');

        return el.querySelectorAll('.word');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TWO CORE ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function animPessimistic(el, text) {
        const words = spannify(el, text);
        words.forEach(w => gsap.set(w, {
            x: (Math.random() - 0.5) * 90,
            y: (Math.random() - 0.5) * 45,
            opacity: 0,
        }));
        const tl = gsap.timeline();
        tl.to(words, {
            opacity: 1, x: 0, y: 0,
            duration: 0.65,
            stagger: { each: 0.09, from: 'random' },
            ease: 'power2.out',
        });
        const lastWord = words[words.length - 1];
        const isButLine = lastWord && lastWord.textContent.toLowerCase().replace(',', '') === 'but';
        const dimTargets = isButLine ? Array.from(words).slice(0, -1) : words;
        tl.to(dimTargets, {
            opacity: 0.3,
            duration: 1.4,
            stagger: { each: 0.1, from: 'end' },
            ease: 'power1.in',
        }, '+=0.25');
        if (isButLine) {
            for (let i = 0; i < 4; i++) {
                tl.to(lastWord, { opacity: 1, duration: 0.08 });
                tl.to(lastWord, { opacity: 0.2, duration: 0.08 });
            }
            tl.to(lastWord, { opacity: 1, color: 'hsl(140, 40%, 72%)', duration: 0.3, ease: 'power2.out' });
        }
        return tl;
    }

    function animOptimistic(el, text) {
        const words = spannify(el, text);

        el.querySelectorAll('.emphasis').forEach(word => {
            word.classList.add('underline-visible');
        });

        gsap.set(words, { opacity: 0, y: 40, color: '#121212' });
        const tl = gsap.timeline();
        tl.to(words, {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.6)',
        });
        tl.to(words, {
            color: '#121212',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power1.out',
        }, '-=0.5');
        return tl;
    }

    function runAnimation(el, entry, isReverse) {
        gsap.set(el, { clearProps: 'all' });
        el.innerHTML = '';
        if (isReverse) animOptimistic(el, entry.text);
        else animPessimistic(el, entry.text);
    }

    // ─── Title animation ─────────────────────────────────────────────────────────
    function animTitle() {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo('#lost', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        tl.fromTo('#generation', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
        tl.fromTo('#author', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, '-=0.2');
        return tl;
    }

    // ─── Hover interactions ──────────────────────────────────────────────────────
    const hoverState = new WeakMap();

    function attachHover(h2, sign) {
        const fresh = h2.cloneNode(true);
        h2.parentNode.replaceChild(fresh, h2);
        // if (sign === 'pos') return fresh;

        if (sign === 'neg' || sign === 'pos' || sign === 'neu' || sign === 'both') {
            fresh.addEventListener('mouseenter', () => {
                const words = fresh.querySelectorAll('.word');
                if (!words.length) return;
                const tl = gsap.timeline();
                words.forEach(w => tl.to(w, {
                    x: (Math.random() - 0.5) * 55,
                    y: (Math.random() - 0.5) * 25,
                    opacity: 0.35, duration: 0.55, ease: 'power2.out',
                }, 0));
                hoverState.set(fresh, tl);
            });
            fresh.addEventListener('mouseleave', () => {
                const prev = hoverState.get(fresh);
                if (prev) prev.kill();
                gsap.to(fresh.querySelectorAll('.word'), {
                    x: 0, y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.8)',
                });
            });
        }
        return fresh;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CUSTOM CURSOR
    // ═══════════════════════════════════════════════════════════════════════════
    const cursorEl = document.getElementById('cursor');
    let cursorMode = 'dark'; // tracks current section bg

    window.addEventListener('mousemove', e => {
        cursorEl.style.left = e.clientX + 'px';
        cursorEl.style.top = e.clientY + 'px';
    });

    function setCursorColor(mode) {
        cursorMode = mode;
        if (mode === 'light') {
            cursorEl.style.backgroundColor = '#121212';
        } else {
            // dark, title, reflect
            cursorEl.style.backgroundColor = '#D6E4C8';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TSPARTICLES — lazy initialise per section on first visit
    // ═══════════════════════════════════════════════════════════════════════════

    const initialised = new Set();

    // Fire config: dark bg #121212, particles in #D6E4C8 palette
    const fireConfig = {
        preset: 'fire',
        background: {
            image: 'radial-gradient(#121212, #121212)',
        },
        particles: {
            color: {
                value: ['#D6E4C8', '#b8c9a8', '#8aaa78', '#e8f0de'],
            },
        },
        fullScreen: {
            enable: false
        }
    };

    // Firefly config: light bg #D6E4C8, fireflies in #121212
    const fireflyConfig = {
        preset: 'firefly',
        background: {
            color: '#D6E4C8'
        },
        particles: {
            color: { value: '#121212' },
        },
        fullScreen: {
            enable: false
        }
    };

    async function initParticles(containerId, isDark) {
        if (initialised.has(containerId)) return;
        initialised.add(containerId);

        try {
            if (isDark) {
                await loadFirePreset(tsParticles);
                await tsParticles.load({ id: containerId, options: fireConfig });
            } else {
                await loadFireflyPreset(tsParticles);
                await tsParticles.load({ id: containerId, options: fireflyConfig });
            }
        } catch (e) {
            console.warn('tsParticles failed for', containerId, e);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REFLECTIVE QUESTIONNAIRE
    // ═══════════════════════════════════════════════════════════════════════════
    const answers = {};

    const notes = {
        neg: `you struggle to see your own value — and that's okay. you don't have to believe it fully yet. just choose, today, to hold the possibility open:
<em>you are worth more than the loudest voice in your head.</em>`,

        neu: `you're somewhere in between — and that's honest.
some days the light gets in, some days it doesn't. that's not weakness; that's awareness.
the choice to see your own value isn't a feeling you wait for, it's a practice you return to.
<em>you already know how to choose it. keep choosing.</em>`,

        pos: `you're able to see your own worth — and that's incredible!
but here's a quiet invitation: there are people in your life who hear the same voice of doubt you may have used to hear more loudly.
<em>be the voice that tells them otherwise.</em>`,
    };

    function scoreSentiment() {
        const vals = Object.values(answers);
        if (!vals.length) return 'neu';
        const counts = { neg: 0, neu: 0, pos: 0 };
        vals.forEach(v => counts[v]++);
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    function initQuestionnaire() {
        const blocks = document.querySelectorAll('.question-block');

        // Reveal first question immediately when section loads
        blocks[0].classList.add('visible');

        document.querySelectorAll('.opt-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const q = this.dataset.q;
                const val = this.dataset.val;

                document.querySelectorAll(`.opt-btn[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                answers[q] = val;

                const nextBlock = document.getElementById(`q${parseInt(q) + 1}`);
                if (nextBlock) {
                    setTimeout(() => nextBlock.classList.add('visible'), 200);
                }

                // After last question answered, show note then form
                if (q === '3') {
                    const noteEl = document.getElementById('reflection-note');
                    const sentiment = scoreSentiment();
                    noteEl.innerHTML = notes[sentiment];

                    setTimeout(() => {
                        noteEl.classList.add('visible');
                    }, 300);

                    setTimeout(() => {
                        document.getElementById('universe-form').classList.add('visible');
                    }, 1100);
                }
            });
        });

        document.getElementById('send-btn').addEventListener('click', function () {
            const msg = document.getElementById('universe-msg').value.trim();
            const sentEl = document.getElementById('sent-msg');

            const closing = msg
                ? `✦ message sent into the universe.`
                : `✦ your thoughts matter and were heard today.`;

            sentEl.innerHTML = closing;
            setTimeout(() => sentEl.classList.add('visible'), 50);
            gsap.to('#universe-input', { opacity: 0, duration: 0.4, ease: 'power1.in' });
        });
    }

    // ─── fullPage.js init ────────────────────────────────────────────────────────
    new fullpage('#fullpage', {
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
        scrollOverflow: false, // must be false — we handle no-scroll in CSS
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

        afterLoad: function (origin, destination) {
            const idx = destination.index;
            const type = destination.item.dataset.sectionType;

            // ── Cursor color ──
            setCursorColor(type === 'light' ? 'light' : 'dark');

            // ── Particles: init on first visit ──
            if (type === 'dark') {
                const canvas = destination.item.querySelector('.particles-canvas');
                if (canvas) initParticles(canvas.id, true);
            } else if (type === 'light') {
                const canvas = destination.item.querySelector('.particles-canvas');
                if (canvas) initParticles(canvas.id, false);
            }

            // ── Poem animation ──
            const data = getSectionData(idx);
            if (data === null) {
                if (idx === 0) animTitle();
                return;
            }

            const entry = poem[data.poemIndex];
            const h2 = destination.item.querySelector('h2');
            if (!h2) return;

            runAnimation(h2, entry, data.isReverse);

            setTimeout(() => {
                attachHover(destination.item.querySelector('h2'), entry.sign);
            }, 900);
        },

        afterRender: function () {
            animTitle();
            initQuestionnaire();
            console.log("tsParticles", tsParticles);
            console.log("loadFirePreset", typeof loadFirePreset);
            console.log("loadFireflyPreset", typeof loadFireflyPreset);
        },

        beforeLeave: function () { },
        onLeave: function () { },
        afterResize: function () { },
        afterReBuild: function () { },
        afterResponsive: function () { },
        afterSlideLoad: function () { },
        onSlideLeave: function () { },
        onScrollOverflow: function () { },
    });

})();