
import type {Component, PropType} from 'vue';
import {defineComponent, ref} from 'vue';
import { useRouter } from 'vue-router';
import type {ModalProps} from 'ant-design-vue';

type DialogProps = Partial<ModalProps> & {
    style?: Partial<CSSStyleDeclaration>,
}

type Comp = Component & {
    onlyClose?: boolean,
}

type Options = {
    dialogProps?: DialogProps,
    onlyClose?: boolean,
    closeText?: string
};

type OpenFunc = (Comp: Comp, compProps?: any, options?: Options) => Promise<any>;

type OneParamsVoidFn = (value?: any) => void;
type NoParamsVoidFn = () => void;

interface ModalItem {
    comp: Comp,
    compProps: any,
    dialogProps: DialogProps,
    visible: boolean,
    resolve: OneParamsVoidFn,
    reject: OneParamsVoidFn
}

type ModalMap = {
    [propName:string]: ModalItem
}

export type ModalType = {
    open: OpenFunc,
    openModal: OpenFunc,
    clearAll: NoParamsVoidFn
}

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
    },
    setup(props){
        const router = useRouter()

        const modalMap = ref<ModalMap>({});

        const closeModal = (key: string):void => {
            modalMap.value[key].visible = false;
        };

        const clearModal = (key: string):void => {
            delete modalMap.value[key];
        };

        const clearAll: NoParamsVoidFn = () => {
            modalMap.value = {};
        };

        router.beforeEach(() => {
            clearAll();

            return true;
        });


        return () => (
            <>
                {Object.entries(modalMap.value).map(([key, {
                    comp:modalComp, compProps, dialogProps, visible, resolve, reject
                }]) => {
                    const dismiss = (reason?: any) => {
                        closeModal(key);
                        reject(reason);
                    };

                    const close = (value?: any) => {
                        closeModal(key);
                        resolve(value);
                    };

                    return (
                        <modalComp {...{
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
                        }}/>
                    );
                })}
            </>
        );
    }
});
