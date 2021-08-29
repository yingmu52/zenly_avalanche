
const path = require('path');
const json0126 = require(path.join(__dirname, 'data/2021-01-26.json'));
const json0127 = require(path.join(__dirname, 'data/2021-01-27.json'));

const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;
const fs = require('fs');

function exportData(data = []) {
    let points = [];

    for (const item of data) {
        const { utc, latInfo, lonInfo, altitude, bearing, speed, batteryLevel, isAppForeground } = item;
        const point = new Point(parseFloat(latInfo.lat), parseFloat(lonInfo.lon), {
            ele: altitude,
            time: new Date(utc).toLocaleTimeString(),
            bearing,
            speed,
        });
        points.push(point);
    }
    const gpxData = new GarminBuilder();
    gpxData.setSegmentPoints(points);
    return buildGPX(gpxData.toObject());
}

const gpx = exportData([...json0126, ...json0127]);
fs.writeFileSync('data/result.gpx', gpx);