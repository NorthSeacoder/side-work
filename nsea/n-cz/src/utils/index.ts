/*
 * @Author: mengpeng
 * @Date: 2021-05-20 20:33:20
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2022-06-22 16:55:49 
 */

import path from 'path';
import fs from 'fs';

import {getAllWorkspaces} from './workspaces';
import {commonMsg, monoMsg} from './gen-msg';
import type {Option} from '../types/types';

export const getConfig = (projectPath: string = process.cwd()) => {
    try {
        const configPath = path.join(projectPath, 'czrc.json');
        const file = fs.readFileSync(configPath);
        return JSON.parse(file.toString('utf8'));
    } catch (error) {
        return {};
    }
};
//[type][scope] message
export const setCommit = (options: Option) => {
    const workspaces = getAllWorkspaces();
    if (workspaces.length === 0) return commonMsg(options);
    return monoMsg(options, workspaces);
};
