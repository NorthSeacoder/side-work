interface EnumOption {
    queryOnce?: boolean;
    textField?: any;
    valueField?: any;
    textTpl?: string;
    extraMap?: any;
    dataBodyField?: string;
    disabledValues?: any;

    onHandleRecord?: (item: any) => any;
}

const filterBody = (res: any, filterFunc: any) => {
    const {data} = res;
    const body = data.body.filter(filterFunc);
    return {...res, data: {...data, body}};
};

const getKeys = (keyString = '') => keyString.replace(/]/g, '').split(/[[.]/);
const pickValue = (obj: any, keyString: string) => {
    const keys = getKeys(keyString);
    let value = obj;
    try {
        keys.forEach(key => (value = value[key]));
    } catch (err) {
        value = undefined;
    }

    return value;
};


const isTextFieldValid = (textField: any) => (textField !== undefined && textField !== '' && textField !== null);
const getItemText = (item: any, value: any, {textField = 'name', textTpl = ''}) => (
    textTpl ? textTpl.replace(/\{{2}(\w+)\}{2}/g, (match, sub1) => (item[sub1] || '')) : item[textField]
);
const getMapList = (arr: any, options: EnumOption) => {
    const map: any = {};
    const itemMap: any = {};
    const list: any[] = [];
    const {valueField = 'id', onHandleRecord = () => {}} = options;
    arr.forEach((val: any) => {
        if (typeof val === 'string') {
            const obj = {value: val, text: val};
            map[val] = val;
            itemMap[val] = obj;
            list.push(obj);
            return;
        }

        onHandleRecord(val);
        const value = val[valueField];
        const text = getItemText(val, value, options);
        if (isTextFieldValid(text) && isTextFieldValid(value) && !map[value]) {
            const obj = {...val, value, text};
            map[value] = text;
            itemMap[value] = obj;
            list.push(obj);
        }
    });
    return {map, itemMap, list};
};

const handleDisabled = (list: any, options: EnumOption = {}) => {
    const {disabledValues = []} = options;
    if (!disabledValues.length) return;

    list.forEach((item: any) => item.disabled = disabledValues.includes(item.value));
};

export default class Enum {

    options: EnumOption;

    extraMap: any;

    MAP: any;
    
    REVERSEMAP:any;

    LIST: any;

    TYPE: any;

    ITEM_MAP: any;

    superEnum: any;

    QUERY_PROMISE: Promise<any>;

    static from(map: any, options: EnumOption = {}) {
        const yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = options.extraMap || {};
        yqgEnum.populate({map});
        return yqgEnum;
    }

    static fromArray(arr: any, options: EnumOption = {}) {
        const yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = options.extraMap || {};
        yqgEnum.populate(getMapList(arr, options));
        return yqgEnum;
    }

    static query(fetch: any, options: EnumOption = {}) {
        const {
            dataBodyField = '', queryOnce = false, extraMap = {}
        } = options;
        const yqgEnum = new Enum();
        yqgEnum.options = options;
        yqgEnum.extraMap = extraMap;
        yqgEnum.populate({map: {}, itemMap: {}});
        // @ts-ignore
        yqgEnum.query = (...args: any) => {
            if (queryOnce && yqgEnum.QUERY_PROMISE) {
                return yqgEnum.QUERY_PROMISE;
            }

            yqgEnum.QUERY_PROMISE = fetch(...args).then((resp: any) => {
                let {data: {body}} = resp;
                if (!body) return resp;

                if (dataBodyField) {
                    body = pickValue(body, dataBodyField);
                }

                let mapList: any = {};
                if (Array.isArray(body)) {
                    mapList = getMapList(body, options);
                } else {
                    mapList.map = body || {};
                }

                yqgEnum.populate(mapList);

                return resp;
            }).catch((err: any) => {
                yqgEnum.QUERY_PROMISE = null;
                return Promise.reject(err);
            });

            return yqgEnum.QUERY_PROMISE;
        };

        return yqgEnum;
    }

    static filter(superEnum: any, filterFn: any, options: EnumOption) {
        let filteredEnum = null;
        if ('query' in superEnum) {
            filteredEnum = Enum.query(
                () => superEnum.query().then((res: any) => filterBody(res, filterFn)),
                options || superEnum.options
            );
        } else {
            filteredEnum = Enum.from(filterFn(superEnum.MAP));
        }

        filteredEnum.superEnum = superEnum;
        return filteredEnum;
    }

    static map(baseEnum: any, options: EnumOption) {
        return Enum.query(baseEnum.query, options);
    }

    populate({map, itemMap, list}: any) {
        this.MAP = map;
        this.ITEM_MAP = itemMap;
        this.LIST = list || Object.keys(map).map(value => ({value, text: map[value]}));
        handleDisabled(this.LIST, this.options);
        this.TYPE = {};
        this.REVERSEMAP={};
        Object.keys(map).forEach(value =>{
            this.TYPE[value] = value
            this.REVERSEMAP[map[value]]=value
        });

    }

    getText(value: any) {
        const {MAP, extraMap, superEnum, options, options: {textField, textTpl}} = this;
        let text = MAP[value] || extraMap[value];
        if (!text && superEnum) {
            const {options: {textField: superTextField, textTpl: superTextTpl}} = superEnum;
            if (textField === superTextField && textTpl === superTextTpl) {
                text = superEnum.MAP[value];
            } else {
                text = getItemText(superEnum.ITEM_MAP[value] || {}, value, options);
            }
        }

        return text || value;
    }

}
