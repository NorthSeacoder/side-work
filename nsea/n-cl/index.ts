import Q from 'q';
import generateCL from 'conventional-changelog';
import fs from 'fs';

import parserOpts from './utils/parser-opts';
import writerOpts from './utils/writer-opts';
import conventionalChangelog from './utils/conventional-changelog';
import recommendedBumpOpts from './utils/conventional-recommended-bump';

const config = Q.all([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]).spread(
    (conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
        return {conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts};
    }
);
export default (path) => {
    generateCL({config, append: true}, {}, {path}).pipe(fs.createWriteStream('CHANGELOG.md'));
};
