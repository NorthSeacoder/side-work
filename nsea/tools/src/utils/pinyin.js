import pinyinUtil from './pinyinjs';
import {postOrderTreeList} from './tree';

/**
 * 
 * @param {*} item 
 * @param {*} options [{getPinyinText:()=>{},getPinyinExtra:()=>{},key:string},...]
 */
const handlepinyin = (item, options) => {
    const {text} = item;
    options.forEach((option) => {
        const {getPinyinText = () => {}, getPinyinExtra = () => {}, key = 'pinyin'} = option;
        const pinyinText = (getPinyinText && getPinyinText(item)) || text;
        const firstLetter = pinyinUtil.getFirstLetter(pinyinText, true);
        const normal = pinyinUtil.getPinyin(pinyinText, '', false, true);
        const extra = getPinyinExtra && getPinyinExtra(item);
        item[key] = []
            .concat(firstLetter, normal, text, extra)
            .join('\n')
            .toLocaleLowerCase();
    });

};

export const handlePinyinWithList = (list, options = []) => list.forEach(item => handlepinyin(item, options)); //eslint-disable-line
export const handlePinyinWithTree = (tree, options = []) => postOrderTreeList(tree, item => handlepinyin(item, options)); //eslint-disable-line
