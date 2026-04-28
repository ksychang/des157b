(function () {

    /* The vision:
    Grid of dots, each dot represents one notification.
    Date recorded at top of page. Legend for colors of notification app on the left.
    Move to next day by clicking anywhere on right side of the page.
    Move to previous day by clicking anywhere on left side of the page.
    Dots appear randomly depending on the hour in appropriate color.

    Date: 4/5/2026 - 4/11/2026

    constants:
    maxDots
    dotsPerRow
    numRows

    Rows dynamically generated based on maxDots, dotsPerRow, and numRows.
    */

    'use strict';
    console.log('reading js');

    const GRID_SLOTS = 510;

    async function getData() {
        const data = await fetch('data.json');
        const json = await data.json();
        console.log(json);

        let currDay = 0;
        updateStats(json, currDay);
        const maxDots = getMaxDots(json, currDay);
        createGrid(maxDots, json[currDay].categories);

        // handle clicks
        window.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowRight') {
                currDay = (currDay + 1) % 7;
                updateStats(json, currDay);
                createGrid(getMaxDots(json, currDay), getCategories(json, currDay), getValues(json, currDay));
            } else if (event.key === 'ArrowLeft') {
                if (currDay == 0) {
                    currDay = 7;
                }
                currDay = (currDay - 1) % 7;
                updateStats(json, currDay);
                createGrid(getMaxDots(json, currDay), getCategories(json, currDay), getValues(json, currDay));
            }

        });
    }

    getData();

    // get day from json
    function updateStats(data, date_index) {
        const day = data[date_index].day;
        document.querySelector('#day').textContent = day;

        const notifs = data[date_index].total;
        document.querySelector('#notifs').textContent = notifs;
    }

    // create grid
    function createGrid(maxdots, categories, values) {
        let usedDots = [maxdots];
        clearDots();

        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            let dots_to_fill = values[i];
            styleDots(category, dots_to_fill, usedDots, maxdots);
        }
    }

    function styleDots(category, numDots, usedDots, maxdots) {
        for (let count = 0; count < numDots; count++) {
            console.log("count = " + count);
            let i = Math.floor(Math.random() * GRID_SLOTS) + 1;
            if (usedDots.includes(i)) {
                continue;
            }
            usedDots.push(i);
            let dot = document.querySelector(`#dot${i}`);
            dot.classList.add(category);
            dot.style.backgroundColor = 'white';
        }
    }

    function getMaxDots(json, currDay) {
        return json[currDay].total;
    }

    function getCategories(json, currDay) {
        return Object.keys(json[currDay].categories);
    }

    function getValues(json, currDay) {
        return Object.values(json[currDay].categories);
    }

    function clearDots() {
        const dots = document.querySelectorAll('.dot');
        for (let i = 0; i < dots.length; i++) {
            console.log('cleared dot ' + i);
            dots[i].className = "dot";
            dots[i].style.backgroundColor = 'black';
        }
    }



})();