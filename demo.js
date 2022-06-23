var conventionalChangelog = require('conventional-changelog');

const fs = require('fs');
const config = require('./config/change-log-config');

conventionalChangelog({
    // preset: {name: 'angular', ...config}
    preset: 'angular'
},{},{},config.parserOpts).pipe(fs.createWriteStream('CHANGELOG.md'));
