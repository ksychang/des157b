(function () {
    'use strict';
    console.log('reading js');

    // Adding sound
    const audio = new Audio('media/underwater.mp3');
    audio.loop = true;

    const myVideo = document.querySelector('#aquarium');
    const volToggle = document.querySelector('i');
    let muted = true;

    myVideo.volume = 0;

    volToggle.addEventListener('click', function () {
        console.log('clicked');
        changeColors();
        if (muted) {
            volToggle.classList.remove('fa-volume-mute');
            volToggle.classList.add('fa-volume-up');
            audio.play();
            muted = false;
        } else {
            volToggle.classList.remove('fa-volume-up');
            volToggle.classList.add('fa-volume-mute');
            audio.pause();
            muted = true;
        }
    });

    const line1 = document.querySelector('#line1');
    const line2 = document.querySelector('#line2');
    const line3 = document.querySelector('#line3');
    const line4 = document.querySelector('#line4');
    const line5 = document.querySelector('#line5');

    const poem = {
        start: [1, 4, 7, 10, 13],
        stop: [3, 6, 9, 12, 15],
        line: [line1, line2, line3, line4, line5]
    }

    const intervalID = setInterval(checkTime, 1000);

    async function checkTime() {
        for (let i = 0; i < poem.start.length; i++) {
            if (poem.start[i] < myVideo.currentTime && poem.stop[i] > myVideo.currentTime) {
                poem.line[i].classList.remove('hidden');
                poem.line[i].classList.remove('fade-out');
                poem.line[i].classList.add('visible');
            } else {
                if (poem.line[i].classList.contains('visible')) {
                    poem.line[i].classList.remove('visible');
                    poem.line[i].classList.add('fade-out');
                } else {
                    poem.line[i].classList.add('hidden');
                }
            }
        }
    }

    function changeColors() {
        const p = document.querySelectorAll('p');
        if (muted) {
            myVideo.style.filter = 'grayscale(0%)';
            p.forEach(function (item) {
                item.style.color = 'white';
            });
            volToggle.style.color = 'white';
        } else {
            myVideo.style.filter = 'grayscale(100%)';
            p.forEach(function (item) {
                item.style.color = 'red';
            });
            volToggle.style.color = 'red';
        }
    }

})();