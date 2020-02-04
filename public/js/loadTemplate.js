const { readFileSync } = require('fs');
const TEMPLATES = `${__dirname}/../templates`;

module.exports = { loadTemplate: fillTemplate };
