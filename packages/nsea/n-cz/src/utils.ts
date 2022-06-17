/*
 * @Author: mengpeng
 * @Date: 2021-05-20 20:33:20
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-05-21 16:27:01 
 */

import map from 'lodash.map';
import longest from 'longest';
import path from 'path';
import fs from 'fs';

interface Scope {
    name: String;
    value: String;
}
interface Option {
    types?: Object;
    defaultType?: String;
    defaultScope?: String;
    scopes?: Array<Scope>;
}
interface Type {
    description?: String;
    title?: String;
}
interface Answer {
    type?: String;
    scope?: String;
    message?: String;
}
export const getConfig = (projectPath: string = process.cwd()) => {
    const configPath = path.join(projectPath, 'czrc.json');
    const file = fs.readFileSync(configPath);
    return JSON.parse(file.toString('utf8'));
};
//[type][scope] message
export const setCommit = (options: Option) => {
    const {types, defaultScope, defaultType, scopes} = options;

    const length = longest(Object.keys(types)).length + 1;

    var choices = map(types, function (type: Type, key: String) {
        return {
            name: (key + ':').padEnd(length) + ' ' + type.description,
            value: key,
        };
    });
    const isInput = !scopes || scopes.length === 0;
    const promptOption = [
        {
            type: isInput ? 'input' : 'list',
            name: 'scope',
            message: isInput ? '本次改动涉及范围 (e.g. 组件 or 文件名):' : '选择此次提交的项目',
            choices: isInput ? null : scopes,
            default: !isInput ? null : defaultScope,
        },
        {
            type: 'list',
            name: 'type',
            message: '选择此次提交的改动类型:',
            choices: choices,
            default: defaultType,
        },
        {
            type: 'input',
            name: 'message',
            message: '本次修改的概要信息',
        },
    ];
    return {
        prompter: (cz: any, commit: any) => {
            cz.prompt(promptOption).then((answer: Answer) => {
                const {type, scope, message} = answer;
                const head = `[${scope}][${type}] ${message}`;
                commit(head);
            });
        },
    };
};
