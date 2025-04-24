const fs = require('fs');

// Read the CSV file
const csvContent = fs.readFileSync('./systems.csv', 'utf8');

// Split into lines and remove the header
const lines = csvContent.split('\n').slice(1);

const systems = lines
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
        const [solarSystemId, solarSystemName, security, regionID, wormholeClassId, connectedSystems] = line.split('\t');
        
        return {
            solarSystemId: parseInt(solarSystemId),
            solarSystemName,
            security: parseFloat(security),
            regionID: parseInt(regionID),
            wormholeClassId: parseInt(wormholeClassId),
            connectedSystems: connectedSystems ? 
                connectedSystems.split(',').map(id => parseInt(id)) : 
                []
        };
    });

// Write the JSON file
fs.writeFileSync(
    '../public/systems.json',
    JSON.stringify(systems, null, 2)
);

console.log('Conversion completed! Check systems.json');