'use strict';

import compareFunc from 'compare-func';
import Q from 'q';
import fs from 'fs';
import {resolve} from 'path';

const readFile = Q.denodeify(fs.readFile);

export default Q.all([
    readFile(resolve(__dirname, '../templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/commit.hbs'), 'utf-8')
]).spread((template, header, commit) => {
    const writerOpts: WriterOpts = getWriterOpts();

    writerOpts.mainTemplate = template;
    writerOpts.headerPartial = header;
    writerOpts.commitPartial = commit;

    return writerOpts;
});
interface WriterOpts {
    transform: (commit: any, context: any) => any;
    mainTemplate?: string;
    headerPartial?: string;
    commitPartial?: string;
    footerPartial?: string;
    groupBy: string;
    commitGroupsSort: string;
    commitsSort: string[];
    noteGroupsSort: string;
    notesSort: any;
}
const typeMap = {
    feat: 'Features',
    fix: 'Bug Fixes',
    init: 'Initial',
    docs: 'Documentation',
    style: 'Styles',
    refactor: 'Code Refactoring',
    perf: 'Performance Improvements',
    test: 'Tests',
    build: 'Builds',
    ci: 'Continuous Integration'
};
function getWriterOpts() {
    return {
        transform: (commit, context) => {
            // const issues = [];
            // console.log({commit})
            const {type} = commit;
            commit.type = typeMap[type];

            if (commit.scope === '*') {
                commit.scope = '';
            }

            if (typeof commit.hash === 'string') {
                commit.shortHash = commit.hash.substring(0, 7);
            }

            return commit;
        },
        groupBy: 'type',
        commitGroupsSort: 'title',
        commitsSort: ['scope', 'subject'],
        noteGroupsSort: 'title',
        notesSort: compareFunc
    };
}
