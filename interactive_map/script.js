(function () {
    'use strict';

    // add your script here
    var map = L.map('hunt_hall').setView([38.543497, -121.750463], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker([38.543497, -121.750463]).addTo(map);
    marker.bindPopup("This is where I met my first friend in Davis!").openPopup();

    var circle = L.circle([38.543968, -121.746875], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10
    }).addTo(map);
    circle.bindPopup("This is where I found my community in Davis :)");

    var polygon = L.polygon(
        [
            [38.542749, -121.748666],
            [38.542544, -121.748585],
            [38.542636, -121.748296],
            [38.542812, -121.748398]
        ],
        {
            color: 'red'
        }
    ).addTo(map);
    polygon.bindPopup("This is where I meet with my fellowship every Tuesday!");

}());