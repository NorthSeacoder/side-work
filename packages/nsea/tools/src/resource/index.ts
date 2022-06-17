
import axios, {Method} from 'axios';

interface CustomConfig {
    url: string;
    method?: Method;
    link?: boolean;
    download?: boolean;
    targetSelf?: boolean;
    formData?: boolean | FormDataConfig;
}

interface Options {
    url?: string;
    getHost?: () => string;
}

enum ObjectKey {
    Dot = '.k',
    Bracket = '[k]',
    Whole = 'json'
}

enum ArrayKey {
    None = '',
    Dot = '.i',
    Bracket = '[i]',
    EmptyBracket = '[]',
    Whole = 'json'
}

interface FormDataConfig {
    objectKey?: ObjectKey;
    arrayKey?: ArrayKey;
}

export const setUrlParams = (path: string, ...args: any[]) => {
    if (!/:/.test(path)) return path;

    const isFormData = typeof FormData !== 'undefined' && args[0] instanceof FormData;
    let {params = ''} = args[1] || args[0] || {};
    if (!params) params = args[0] || {}; // post、put 的 data
    return path.replace(/\/:([^/]+)/g, (match, key) => {
        const replacement = (isFormData ? params.get(key) : params[key]) || '';
        delete params[key];
        return `/${replacement}`;
    });
};

export const objToFormData = (obj: any, config: FormDataConfig) => {
    if (!obj) return obj;

    const {objectKey = ObjectKey.Dot, arrayKey = ArrayKey.None} = config;
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
        let curData = obj[key];
        if (curData === undefined || curData === null) return;

        if (curData && curData.constructor === Array) {
            switch (arrayKey) {
                case ArrayKey.None:
                case ArrayKey.Dot:
                case ArrayKey.Bracket:
                case ArrayKey.EmptyBracket:
                    curData.forEach((item: any, idx: any) => {
                        formData.append(`${key}${arrayKey.replace('i', idx)}`, item);
                    });
                    return;
                case ArrayKey.Whole:
                    curData = JSON.stringify(curData);
                    break;
            }
        }

        if (curData && curData.constructor === Object) {
            switch (objectKey) {
                case ObjectKey.Dot:
                case ObjectKey.Bracket:
                    Object.keys(curData).forEach((subKey) => {
                        formData.append(`${key}${objectKey.replace('k', subKey)}`, curData[subKey]);
                    });
                    return;
                case ObjectKey.Whole:
                    curData = JSON.stringify(curData);
                    break;
            }
        }

        formData.append(key, curData);
    });

    return formData;
};

export {axios};

export default class Resource implements Options {

    constructor({url, getHost, ...config}: Options) {
        this.url = url;
        this.getHost = getHost;
        ['get', 'patch', 'post', 'put', 'delete', 'save', 'savePatch'].forEach(
            method => this[method] = this[method].bind(this)
        );
        this.extend(config);
    }

    static create(opts: Options) {
        return new Resource(opts);
    }

    url: string;

    getHost: () => string;

    [key: string]: any;
    
    extend(config: any) {
        Object.keys(config).forEach((key) => {
            const {method, url, link, download, targetSelf, formData}: CustomConfig = config[key];
            // @ts-ignore
            const request = axios[method];

            if (!(link || download || targetSelf) && !request) {
                throw new Error(`Method [${method}] is not valid http verb!`);
            }

            // @ts-ignore
            this[key] = (...args: any[]) => {
                const [parsedUrl, cd, ...restArgs] = this.parse(url, ...args);
                let configOrData = cd;
                if (link || download || targetSelf) {
                    // 计算link支持下直接传data当作config.params
                    const {params = configOrData} = configOrData || {};
                    const requestUrl = axios.getUri({params, url: parsedUrl});
                    if (download) window.open(requestUrl);

                    if (targetSelf) window.location.href = requestUrl;

                    return requestUrl;
                }

                if (formData) {
                    configOrData = objToFormData(configOrData, formData as FormDataConfig);
                }

                return request(parsedUrl, configOrData, ...restArgs);
            };
        });
    }

    parse(url: any, ...args: any) {
        // @ts-ignore
        const {getHost = ''} = this;
        const parsedArgs = args.map((params: any) => (params instanceof Array ? [...params] : params && {...params}));
        const parsedUrl = `${getHost && getHost()}${setUrlParams(url, ...parsedArgs)}`;
        return [parsedUrl, ...parsedArgs];
    }

    get(...args: any[]): Promise<any> {
        // @ts-ignore
        return axios.get(...this.parse(this.url, ...args));
    }

    patch(...args: any[]): Promise<any> {
        // @ts-ignore
        return axios.patch(...this.parse(this.url, ...args));
    }

    post(...args: any[]): Promise<any> {
        // @ts-ignore
        return axios.post(...this.parse(this.url, ...args));
    }

    put(...args: any[]): Promise<any> {
        // @ts-ignore
        return axios.put(...this.parse(this.url, ...args));
    }

    delete(...args: any[]): Promise<any> {
        // @ts-ignore
        return axios.delete(...this.parse(this.url, ...args));
    }

    save(data: any, options = {id: 'id'}): Promise<any> {
        return this[data[options.id] ? 'put' : 'post'](data, options);
    }

    savePatch(data: any, options = {id: 'id'}): Promise<any> {
        return this[data[options.id] ? 'patch' : 'post'](data, options);
    }

}
