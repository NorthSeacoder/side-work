/*
 * @Author: mengpeng
 * @Date: 2021-05-20 20:32:50
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2021-05-20 20:38:29 
 */

import {defaultTypes} from './constant';
import {setCommit, getConfig} from './utils';

const {types, defaultType, defaultScope, ...extra} = getConfig();
const options = {
    types: types || defaultTypes,
    defaultType: process.env.CZ_TYPE || defaultType,
    defaultScope: process.env.CZ_SCOPE || defaultScope,
    ...extra,
};

export default setCommit(options);
