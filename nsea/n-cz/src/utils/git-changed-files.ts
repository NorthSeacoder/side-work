/*
 * @Author: youboli
 * @Date: 2022-05-06 11:38:45
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2022-07-01 16:55:32 
 */

import {spawnSync} from 'child_process';
import type {ChangeFile} from '../types/types';

function getFiles(cmd: string) {
    const [command, ...args] = cmd.split(' ');
    const result = spawnSync(command, args);
    const files = result.stdout.toString().split('\n').slice(0, -1);
    const whiteFiles = ['pnpm-lock.yaml'];
    return files.filter((item) => !whiteFiles.includes(item));
}
// function unique(stagedFiles, unStagedFiles) {
//     return [...new Set([...stagedFiles, ...unStagedFiles])];
// }

// 目前不可配置
export default function gitChangedFiles(): ChangeFile {
    const baseCmd = 'git diff --relative --name-only --diff-filter=ACDMRTUXB';
    const committedCmd = baseCmd.concat(' origin/master...HEAD');
    const stagedCmd = baseCmd.concat(' --staged');

    const committedFiles = getFiles(committedCmd);
    const stagedFiles = getFiles(stagedCmd);
    // const unStagedFiles = getFiles(baseCmd);

    // const unCommittedFiles = unique(stagedFiles, unStagedFiles);

    return {
        committedFiles,
        unCommittedFiles: stagedFiles
    };
}
