import map from 'lodash.map';
const longest = require('longest');
import genTag from './gen-tag';
import type {Option, Type, Answer} from '../types/types';

export const commonMsg = (options: Option) => {
    const {types, defaultScope, defaultType, scopes} = options;

    const length = longest(Object.keys(types ?? {})).length + 1;

    var choices = map(types ?? ({} as any), function (type: Type, key: String) {
        return {
            name: (key + ':').padEnd(length) + ' ' + type.description,
            value: key
        };
    });
    const isInput = !scopes || scopes.length === 0;
    const promptOption = [
        {
            type: isInput ? 'input' : 'list',
            name: 'scope',
            message: isInput ? '本次改动涉及范围 (e.g. 组件 or 文件名):' : '选择此次提交的项目',
            choices: isInput ? null : scopes,
            default: !isInput ? null : defaultScope
        },
        {
            type: 'list',
            name: 'type',
            message: '选择此次提交的改动类型:',
            choices: choices,
            default: defaultType
        },
        {
            type: 'input',
            name: 'message',
            message: '本次修改的概要信息'
        }
    ];
    return {
        prompter: (cz: any, commit: (msg: string) => void) => {
            cz.prompt(promptOption).then(async (answer: Answer) => {
                const {type, scope, message} = answer;
                const head = `[${scope}][${type}] ${message}`;
                console.log(head);
                commit(head);
            });
        }
    };
};
export const monoMsg = (options: Option, workspaces: Array<string>) => {
    const {types, defaultType} = options;
    const length = longest(Object.keys(types ?? {})).length + 1;

    var choices = map(types ?? ({} as any), function (type: Type, key: String) {
        return {
            name: (key + ':').padEnd(length) + ' ' + type.description,
            value: key
        };
    });
    const promptOption = [
        {
            type: 'list',
            name: 'type',
            message: '选择此次提交的改动类型:',
            choices: choices,
            default: defaultType
        },
        {
            type: 'input',
            name: 'message',
            message: '本次修改的概要信息'
        }
    ];
    return {
        prompter: (cz: any,commit: (msg: string) => void) => {
            cz.prompt(promptOption).then((answer: Answer) => {
                const {type, message} = answer;
                const tag = genTag(workspaces);
                const head = `${tag}${type}: ${message}`;
                console.log(head);
                commit(head);
            });
        }
    };
};
