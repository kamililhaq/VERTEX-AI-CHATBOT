const fs = require('fs');

let raw = fs.readFileSync('./los_data_12_aug.json', 'utf8');
let parsed = JSON.parse(raw);

// Now parse the string inside
let schemaData = JSON.parse(parsed.schema_metadata);

console.log(schemaData[0]); // First table’s metadata
