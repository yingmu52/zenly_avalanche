const { html2json } = require('html2json');
const fs = require('fs');

function getTimeComponents(timeString) {
    // i.e 23:41:20 -> [23, 41, 20]
    const [hour, minute, second] = timeString.split(':');
    return { hour, minute, second };
}

function getLat(string) {
    const [lat, delta] = string.split(/[\s,±,m]+/)
    return { lat, delta };
}

function getLon(string) {
    const [lon, delta] = string.split(/[\s,±,m]+/)
    return { lon, delta };
}

function traverseJSON(json, extractedNodesHandler) {
    // loop thru trees using stack
    var stack = [json];
    while (stack.length != 0) {
        const lastNode = stack.pop();

        // extract table content
        if (lastNode.tag === 'tr' && lastNode.child.length > 0) {
            const extractedNodes = [];
            for (const childNode of lastNode.child) {
                if (childNode.tag === 'td') {
                    extractedNodes.push(childNode.child[0]);
                }
            }

            if (extractedNodes.length > 0) {
                extractedNodesHandler(extractedNodes);
            }
        }

        // visit child nodes
        for (const node of lastNode.child || []) {
            stack.push(node);
        }
    }
}

function collectData(path, year, month, day) {
    const collectedData = [];

    const data = fs.readFileSync(path, 'utf8')
    const json = html2json(data);
    traverseJSON(json, extractedNodes => {
        const { hour, minute, second } = getTimeComponents(extractedNodes[0].text);
        collectedData.push({
            utc: Date.UTC(year, month - 1, day, hour, minute, second),
            latInfo: getLat(extractedNodes[1].text),
            lonInfo: getLon(extractedNodes[2].text),
            altitude: extractedNodes[3].text,
            bearing: extractedNodes[4].text,
            speed: extractedNodes[5].text,
            batteryLevel: extractedNodes[7].text,
            isAppForeground: extractedNodes[10].text,
        })
    });
    return collectedData;
}

fs.writeFileSync('data/2021-01-26.json', JSON.stringify(collectData('data/2021-01-26.html', 2021, 1, 26)));
fs.writeFileSync('data/2021-01-27.json', JSON.stringify(collectData('data/2021-01-27.html', 2021, 1, 27)));

