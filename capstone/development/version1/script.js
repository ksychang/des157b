(function () {
    'use strict';
    console.log('reading js');


    var myFullpage = new fullpage('#fullpage', {
        // Navigation
        menu: '#menu',
        lockAnchors: false,
        anchors: ['firstPage', 'secondPage'],
        navigation: false,
        navigationPosition: 'right',
        navigationTooltips: ['firstSlide', 'secondSlide'],
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: 'bottom',

        // Scrolling
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
        loopHorizontal: true,
        continuousVertical: true,
        continuousHorizontal: false,
        scrollHorizontally: false,
        interlockedSlides: false,
        dragAndMove: false,
        offsetSections: false,
        resetSliders: false,
        fadingEffect: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: true,
        scrollOverflowMacStyle: false,
        scrollOverflowReset: false,
        skipIntermediateItems: false,
        touchSensitivity: 15,
        bigSectionsDestination: null,
        adjustOnNavChange: true,

        // Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        // Design
        controlArrows: true,
        controlArrowsHTML: [
            '<div class="fp-arrow"></div>',
            '<div class="fp-arrow"></div>'
        ],
        verticalCentered: true,
        sectionsColor: ['#ccc', '#fff'],
        paddingTop: '3em',
        paddingBottom: '10px',
        fixedElements: '#header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,
        responsiveSlides: false,
        effects: false,
        effectsOptions: [Object],
        cinematic: false,
        cinematicOptions: [Object],
        parallax: false,
        parallaxOptions: { type: 'reveal', percentage: 62, property: 'translate' },
        dropEffect: false,
        dropEffectOptions: { speed: 2300, color: '#F82F4D', zIndex: 9999 },
        waterEffect: false,
        waterEffectOptions: { animateContent: true, animateOnMouseMove: true },
        cards: false,
        cardsOptions: { perspective: 100, fadeContent: true, fadeBackground: true },

        // Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',

        lazyLoading: true,
        lazyLoadThreshold: 0,
        observer: true,
        credits: { enabled: true, label: 'Made with fullPage.js', position: 'right' },

        // Events
        beforeLeave: function (origin, destination, direction, trigger) { },
        onLeave: function (origin, destination, direction, trigger) { },
        afterLoad: function (origin, destination, direction, trigger) { },
        afterRender: function () { },
        afterResize: function (width, height) { },
        afterReBuild: function () { },
        afterResponsive: function (isResponsive) { },
        afterSlideLoad: function (section, origin, destination, direction, trigger) { },
        onSlideLeave: function (section, origin, destination, direction, trigger) { },
        onScrollOverflow: function (section, slide, position, direction) { }
    });

    document.addEventListener("DOMContentLoaded", (event) => {
        gsap.registerPlugin(TextPlugin)
        // gsap code here!
        // gsap.to("#lost", {
        //     duration: 2,
        //     text: "LOST",
        //     ease: "none",
        // });

        // gsap.to(document.querySelector('#generation'), {
        //     duration: 2,
        //     text: "GENERATION",
        //     ease: "none",
        // });

        // gsap.to(document.querySelector('#author'), {
        //     duration: 2,
        //     text: "excerpt by Jonathan Reed",
        //     ease: "none",
        // });

        const poem = [
            'I am part of a lost generation',
            'and I refuse to believe that',
            'I can change the world',
            'I realize this may be a shock but',
            '"Happiness comes from within."',
            'is a lie, and',
            '"Money will make me happy."',
            'So in 30 years I will tell my children',
            'they are not the most important thing in my life',
            'My employer will know that',
            'I have my priorities straight because',
            'work',
            'is more important than',
            'family',
            'And all of this will come true unless we choose to REVERSE IT.'
        ]

        const lines = document.querySelectorAll('.poem h2');
        const sections = document.querySelectorAll('.section');
        let i = 0, j = 0;

        sections.forEach(function (section) {
            section.addEventListener('scroll', function (event) {
                console.log('scrolling');
            });
        });

        while (i < poem.length) {
            gsap.to(lines[j], {
                duration: 2,
                text: poem[i],
                ease: "none",
            })
            i++;
            j++;
        }

        i--;

        while (j < lines.length) {
            console.log(j);
            i--;
            gsap.to(lines[j], {
                duration: 2,
                text: poem[i],
                ease: "none",
            })
            j++;
        }

        // lines.forEach(function (line) {
        //     if (i < poem.length) {
        //         gsap.to(line, {
        //             duration: 2,
        //             text: poem[i],
        //             ease: "none",
        //         })
        //         i++;
        //     } else {
        //         i--;
        //         gsap.to(line, {
        //             duration: 2,
        //             text: poem[i],
        //             ease: "none",
        //         })
        //     }
        // })

        // dark_lines.forEach(function (line) {
        //     gsap.to(line, {
        //         duration: 2,
        //         text: poem[i],
        //         ease: "none",
        //     })
        //     i++;
        // });

        // light_lines.forEach(function (line) {
        //     gsap.to(line, {
        //         duration: 2,
        //         text: poem[i - 1],
        //         ease: "none",
        //     })
        //     i--;
        // });

    });
})();