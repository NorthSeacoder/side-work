import Q from 'q';
import parserOpts from './utils/parser-opts';
import writerOpts from './utils/writer-opts';
import conventionalChangelog from './utils/conventional-changelog';
import recommendedBumpOpts from './utils/conventional-recommended-bump';

export default Q.all([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]).spread(
    (conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
        return {conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts};
    }
);
