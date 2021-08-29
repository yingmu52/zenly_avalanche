const fs = require("fs");
const path = require("path");
const json0126 = require(path.join(__dirname, "data/2021-01-26.json"));
const json0127 = require(path.join(__dirname, "data/2021-01-27.json"));

const jsonData = [...json0126, ...json0127].sort((a, b) => {
  if (a.utc < b.utc) {
    return -1;
  }
  if (a.utc > b.utc) {
    return 1;
  }
  if (a.utc === b.utc) {
    return 0;
  }
});

fs.writeFileSync("data/myplaces.csv", "lat, lon, info\n");

for (const item of jsonData) {
  const {
    utc,
    latInfo,
    lonInfo,
    altitude,
    bearing,
    speed,
    batteryLevel,
    isAppForeground,
  } = item;
  fs.appendFileSync(
    "data/myplaces.csv",
    `${latInfo.lat}, ${lonInfo.lon}, ${
      new Date(utc).toLocaleTimeString() +
      ` battery: ${batteryLevel} (${isAppForeground})`
    }\n`
  );
}
