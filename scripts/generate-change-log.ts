import conventionalChangelog from 'conventional-changelog';
import fs from 'fs';
import config from '@nsea/change-log-preset';

conventionalChangelog({config, append: true}).pipe(fs.createWriteStream('CHANGELOG.md'));