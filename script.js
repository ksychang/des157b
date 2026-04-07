(function () {
    'use strict';
    console.log('reading script.js');

    /* TODO:
        * Add toggle for skin switch
        * Skin switch:
            * Fonts (Handlee, IBM Plex Mono)
            * Colors (background paper image, background color)
            * Header animations
            * Toggle image
    */

    // Variables
    const body = document.querySelector('body');
    const h3 = document.querySelectorAll('h3');
    const name = document.querySelector('#name');
    const gif = document.querySelector('#gif');
    const links = document.querySelectorAll('li a');
    let state = 'analog';
    // const toggleImage = document.querySelector('#toggle img');

    // Handle toggle (basic)
    const toggle = document.querySelector('#toggle');
    toggle.addEventListener('click', function () {
        changeSkin();
    });

    function changeSkin() {
        if (state == 'analog') {
            console.log('switching to digital');
            // Switch font
            body.style.fontFamily = 'IBM Plex Mono, monospace';

            // Add h3 typing animations
            h3.forEach(function (h) {
                h.classList.add('typing-text');
            });

            // Switch background and colors
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = 'black';
            body.style.color = 'green';
            links.forEach(link => {
                link.style.color = 'green';
                link.style.fontSize = '16pt';
            });

            // Change name animation
            gif.style.visibility = 'hidden';
            name.style.visibility = 'visible';
            name.classList.add('typing-text');

            // Edit toggle name
            toggle.innerHTML = '<p>analog</p>';
            toggle.style.fontSize = '12pt';

            state = 'digital';
        } else {
            h3.forEach(h => h.classList.remove('typing-text'));
            name.classList.remove('typing-text');
            body.style.fontFamily = 'Caveat';

            body.style.backgroundColor = '#FFFDFF';
            body.style.color = 'black';
            links.forEach(link => {
                link.style.color = 'black';
                link.style.fontSize = '20pt';
            });

            gif.style.visibility = 'visible';
            name.style.visibility = 'hidden';

            // Edit toggle name
            toggle.innerHTML = '<p>digital</p>';
            toggle.style.fontSize = '16pt';

            state = 'analog';
        }
    }

}());