import gitChangedFiles from './git-changed-files';
import type {WorkspaceWeight, ChangeFile} from '../types/types';

const RegxFilenameToWorkspace = /([\w\d-]+\/[\w\d-]+)\//;
const calculateWorkspaceWeight = (workspaces: Array<string>, changedFiles: Array<string>) => {
    const weightMap: WorkspaceWeight = workspaces.reduce((acc, workspace) => ({...acc, [workspace]: 0}), {chore: 0});

    changedFiles.forEach((file) => {
        const matched = file.match(RegxFilenameToWorkspace);
        const workspace: string = matched?.[1] ?? 'chore';

        weightMap[workspace] += 1;
    });

    return weightMap;
};
const arrayToTag = (array: Array<string>) => array.map((folder) => (folder ? `[${folder}]` : '')).join('');
const genTag = (workspace: string) => {
    if (!workspace) return ['', []];
    const tagArray = workspace.split('/');
    const tag = arrayToTag(tagArray);
    return [tag, tagArray];
};

const genMultipleTag = (sortedTagWorkspaces: [string, number][] | [any][]) => {
    const tags: any[] = [];

    sortedTagWorkspaces.forEach(([workspace]) => {
        const [, subTag] = genTag(workspace);

        if (subTag?.length) {
            // 只考虑两层 [][] 的 tag 合并
            if (subTag.length === 2) {
                const targetTag = tags.find((tag) => tag.length === 2 && tag[0] === subTag[0]);

                if (targetTag) {
                    // ['packages', 'cli'] 和 ['packages', 'node'] 合并为 ['packages', 'cli/node']
                    targetTag[1] += '/' + subTag[1];
                } else {
                    tags.push(subTag);
                }
            } else {
                tags.push(subTag);
            }
        }
    });

    return tags.map((tag) => arrayToTag(tag)).join(' & ');
};

export default (workspaces: Array<string>) => {
    const changedFileMap: ChangeFile = gitChangedFiles();
    const hasCommittedFile = !!Object.keys(changedFileMap.committedFiles).length;
    if (hasCommittedFile) {
        process.exit(0);
    }

    const changedFiles: Array<string> = Array.from(
        new Set(Object.values(changedFileMap).reduce((acc, files) => [...acc, ...files], []))
    );
    const weightMap = calculateWorkspaceWeight(workspaces, changedFiles);
    const tagWorkspaces = Object.entries(weightMap).filter(([workspace, weight]) => workspace !== 'chore' &&weight > 0);

    const isMultiple = tagWorkspaces.length > 1;
    let tag;
    if (!isMultiple) {
        [tag] = genTag(tagWorkspaces[0]?.[0]);
    } else {
        const sortedTagWorkspaces = [...tagWorkspaces].sort(
            ([, prevWeight], [, nextWeight]) => nextWeight - prevWeight
        );
        tag = genMultipleTag(sortedTagWorkspaces);
    }
    return tag;
};
