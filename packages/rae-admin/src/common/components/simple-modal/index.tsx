/*
 * @Author: zhaoyang
 * @Date: 2022-02-22 18:34:23
 * @Last Modified by: mengpeng 
 * @Last Modified time: 2022-07-14 21:51:25 
 */

import type {Component, PropType} from 'vue';
import {useRouter} from 'vue-router';
import {defineComponent, ref, toRef, getCurrentInstance} from 'vue';
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

const defaultDialogProps: DialogProps = {
    maskClosable: false,
    destroyOnClose: true,
    footer: null,
    style: {overflowX: 'hidden', overflowY: 'auto'},
    width: 768
};

export default defineComponent({
    name: 'SimpleModal',
    props: {
        dialogProps: {
            type: Object as PropType<DialogProps>,
            default: () => ({})
        },

        disableWatermark: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props) {
        const instance = getCurrentInstance();
        const router = useRouter();
        const modalMap = ref<ModalMap>({});
        const providerDialogProps = toRef(props, 'dialogProps');
        const commonDialogProps = ref<DialogProps>({
            ...defaultDialogProps,
            ...providerDialogProps.value
        });

        const closeModal = (key: string): void => {
            modalMap.value[key].visible = false;
        };

        const clearModal = (key: string): void => {
            delete modalMap.value[key];
        };

        const clearAll: NoParamsVoidFn = () => {
            modalMap.value = {};
        };

        router.beforeEach(() => {
            clearAll();

            return true;
        });

        const openModal: OpenFunc = (comp, compProps, options) => {
            const key = `${comp.name ?? 'modal'}-${Object.values(modalMap.value).length}`;

            return new Promise((resolve, reject) => {
                modalMap.value = {
                    ...modalMap.value,
                    [key]: {
                        comp,
                        compProps,
                        dialogProps: options?.dialogProps,
                        visible: true,
                        resolve,
                        reject
                    }
                } as ModalMap;
            });
        };

        const open: OpenFunc = (modalComp, compProps, options) => {
            const WrappedComp = ({dialogProps, close, dismiss}: WrappedCompProps): Component => {
                const onlyClose = modalComp.onlyClose ?? options?.onlyClose;
                const {closeText} = options ?? {};
                let {footer} = commonDialogProps.value;
                if (onlyClose) {
                    footer = <a-button onClick={close}>{closeText ?? '关闭'}</a-button>;
                }

                return (
                    <a-modal {...dialogProps} footer={footer} onCancel={dismiss}>
                        <modalComp {...compProps} {...{close, dismiss}} />
                    </a-modal>
                );
            };

            return openModal(WrappedComp, null, options);
        };

        const $modal: ModalType = {open, openModal, clearAll};
        console.log(instance)
        if (instance) instance.appContext.config.globalProperties.$modal = $modal;

        return () => (
            <>
                {Object.entries(modalMap.value).map(
                    ([key, {comp: modalComp, compProps, dialogProps, visible, resolve, reject}]) => {
                        const dismiss = (reason?: any) => {
                            closeModal(key);
                            reject(reason);
                        };

                        const close = (value?: any) => {
                            closeModal(key);
                            resolve(value);
                        };

                        return (
                            <modalComp
                                {...{
                                    ...compProps,
                                    key,
                                    dialogProps: {
                                        ...defaultDialogProps,
                                        ...dialogProps,
                                        visible,
                                        onCancel: dismiss,
                                        afterClose: clearModal.bind(null, key)
                                    },
                                    close,
                                    dismiss
                                }}
                            />
                        );
                    }
                )}
            </>
        );
    }
});
