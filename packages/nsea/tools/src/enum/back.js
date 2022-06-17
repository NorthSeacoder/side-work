import {handlePinyinWithList} from './utils/pinyin';

const QUERY_STATE_TYPE = {
    INIT: 'INIT',
    PROCESSING: 'PROCESSING',
    DONE: 'DONE'
};

const DATA_STRUCTURE = {
    MAP: 'map',
    LIST: 'list',
    FOREST: 'forest'
};

const DEFAULT_VALUE_FIELD = 'id';
const DEFAULT_TEXT_FIELD = 'name';

export default class Enum {

    queryState = QUERY_STATE_TYPE.INIT;

    queryPromise = null;

    /**
     *
     * @param {*} map
     * @param {*} options :
     * {
     * structure:string(map|list|forest),
     * supportFilter:boolean,
     * getFilterText:()=>{},getFilterExtra:()=>{}
     * }
     */
    static from(map, options = {}) {
        const yqgEnum = new Enum();

        yqgEnum.populate(map, {structure: DATA_STRUCTURE.MAP, ...options});
        return yqgEnum;
    }

    static query(fetch, options = {}) {
        const {
            queryOnce = false,
            onPickData = res => res.data.body
        } = options;
        const yqgEnum = new Enum();
        yqgEnum.options = options;

        yqgEnum.query = cond => {
            if (queryOnce) {
                if (
                    yqgEnum.queryState === QUERY_STATE_TYPE.DONE
                    || yqgEnum.queryState === QUERY_STATE_TYPE.PROCESSING
                ) {
                    return yqgEnum.queryPromise;
                }
                yqgEnum.queryState = QUERY_STATE_TYPE.PROCESSING;
            }

            yqgEnum.queryPromise = fetch(cond)
                .then(res => {
                    yqgEnum.RESP = res;
                    yqgEnum.DATA = onPickData(res);

                    if (!yqgEnum.DATA) return;

                    yqgEnum.populate(yqgEnum.DATA, options);
                    yqgEnum.queryState = QUERY_STATE_TYPE.DONE;

                    return res; // eslint-disable-line consistent-return
                })
                .catch(x => x);

            return yqgEnum.queryPromise;
        };

        const data = []; // before query
        yqgEnum.populate(data, options);
        return yqgEnum;
    }

    static filter(superEnum, filterFn, options) {
        const {
            onPickData = res => res.data.body,
            ...rest
        } = superEnum.options;
        options = {...rest, ...options};
        let filteredEnum = null;

        if ('query' in superEnum) {
            filteredEnum = Enum.query(
                () => superEnum.query().then(res => {
                        res.data.body = onPickData(res).filter(filterFn);
                        return res;
                    }),
                options
            );
        } else {
            filteredEnum = Enum.from(filterFn(superEnum.MAP));
        }

        filteredEnum.superEnum = superEnum;
        return filteredEnum;
    }

    populate(data, options = {}) {
        const self = this;
        const {
            valueField = DEFAULT_VALUE_FIELD,
            textField = DEFAULT_TEXT_FIELD,
            structure = DATA_STRUCTURE.LIST,
            supportFilter = false,
            getFilterText = ({text}) => text,
            getFilterExtra = () => {},
            onHandleRecord = () => {}
        } = options;

        self.MAP = {};
        self.FILTERMAP = {};
        self.TYPE = {};
        self.LIST = [];
        self.FOREST = [];
        self.find = cond => self.LIST.find(item => Object.keys(cond).every(key => item[key] === cond[key]));
        self.filterData = filterDataFn => {
            const yqgEnum = new Enum();
            yqgEnum.populate(self.LIST.filter(filterDataFn), {valueField, textField});
            return yqgEnum;
        };

        self.findNoState = cond => self.LIST.find(item => Object.keys(cond).every(
                    key => Number(item[key]) === Number(cond[key])
                ));

        switch (structure) {
            case DATA_STRUCTURE.MAP: {
                Object.keys(data).forEach(key => {
                    self.MAP[key] = data[key];
                    self.TYPE[key] = key;
                    self.LIST.push({
                        [key]: data[key],
                        [valueField]: key,
                        [textField]: data[key]
                    });
                });
                break;
            }
            case DATA_STRUCTURE.LIST: {
                data.forEach(record => {
                    onHandleRecord(record);
                    self.MAP[record[valueField]] = record[textField];
                    self.TYPE[record[valueField]] = record[valueField];
                    self.LIST.push(record);
                });
                break;
            }
            case DATA_STRUCTURE.FOREST: {
                const rec = node => {
                    onHandleRecord(node);
                    self.MAP[node[valueField]] = node[textField];
                    self.TYPE[node[valueField]] = node[valueField];
                    self.LIST.push(node);
                    if (node.children && node.children.length > 0) {
                        node.children.forEach(child => rec(child));
                    }
                };

                data.forEach(node => rec(node));
                self.FOREST = data;
                break;
            }
            default: {
                // ignore
            }
        }
        if (supportFilter) {
            handlePinyinWithList(self.LIST, [
                {getPinyinText: getFilterText, getPinyinExtra: getFilterExtra}
            ]);
            self.LIST.forEach(record => {
                self.FILTERMAP[record[valueField]] = {
                    text: record[textField],
                    filter: record.pinyin
                };
            });
        }
    }

}
