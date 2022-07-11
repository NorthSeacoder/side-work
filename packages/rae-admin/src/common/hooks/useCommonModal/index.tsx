import type {Component, PropType} from 'vue';
import type {ModalProps} from 'ant-design-vue';

type DialogProps = Partial<ModalProps> & {
    style?: Partial<CSSStyleDeclaration>;
};

type Comp = Component & {
    onlyClose?: boolean;
};

type Options = {
    dialogProps?: DialogProps;
    onlyClose?: boolean;
    closeText?: string;
};

type OpenFunc = (Comp: Comp, compProps?: any, options?: Options) => Promise<any>;

type OneParamsVoidFn = (value?: any) => void;
type NoParamsVoidFn = () => void;

type WrappedCompProps = {
    dialogProps: DialogProps;
    close: OneParamsVoidFn;
    dismiss: OneParamsVoidFn;
};

interface ModalItem {
    comp: Comp;
    compProps: any;
    dialogProps: DialogProps;
    visible: boolean;
    resolve: OneParamsVoidFn;
    reject: OneParamsVoidFn;
}

type ModalMap = {
    [propName: string]: ModalItem;
};

export type ModalType = {
    open: OpenFunc;
    openModal: OpenFunc;
    clearAll: NoParamsVoidFn;
};

export const useCommonModal = () => {
    const modalMap = ref<ModalMap>({});

    const open: OpenFunc = (comp, compProps, options) => {
        const WrappedComp = ({dialogProps, close, dismiss}: WrappedCompProps): Component => {
            const onlyClose = comp.onlyClose ?? options?.onlyClose;
            const {closeText} = options ?? {};
            let {footer} = compProps.value;
            if (onlyClose) {
                footer = <a-button onClick={close}>{closeText ?? '关闭'}</a-button>;
            }
            return (
                <a-modal {...dialogProps} footer={footer} onCancel={dismiss}>
                    <comp {...compProps} {...{close, dismiss}} />
                </a-modal>
            );
        };
        const key = `${comp.name ?? 'modal'}-${Object.values(modalMap.value).length}`;
        return new Promise((resolve, reject) => {
            modalMap.value = {
                ...modalMap.value,
                [key]: {
                    comp:WrappedComp,
                    compProps,
                    dialogProps: options?.dialogProps,
                    visible: true,
                    resolve,
                    reject
                }
            } as ModalMap;
        });
    };
    return {open};
};
