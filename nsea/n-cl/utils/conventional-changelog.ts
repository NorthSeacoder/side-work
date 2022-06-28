import Q from 'q';
import parserOpts from './parser-opts';
import writerOpts from './writer-opts';

export default Q.all([parserOpts, writerOpts]).spread((parserOpts, writerOpts) => {
    return {parserOpts, writerOpts};
});
