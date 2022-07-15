<template>
    <div class="title">自动评估</div>
    <a-form
        :label-col="{span: 5}"
        :wrapper-col="{span: 17}"
        :model="cond"
        name="form"
        autocomplete="off"
        @finish="onFinish"
    >
        <a-form-item label="资料标题" name="title">
            <a-input v-model:value="cond.title" />
        </a-form-item>
        <a-form-item label="科目" name="subject">
            <a-input v-model:value="cond.subject" />
        </a-form-item>
        <a-form-item label="类型" name="type">
            <a-input v-model:value="cond.type" />
        </a-form-item>
        <a-form-item label="标签" name="tag">
            <a-input v-model:value="cond.tag" />
        </a-form-item>
        <a-form-item label="资料地址" name="address">
            <a-input v-model:value="cond.address" />
        </a-form-item>
        <a-form-item label="课程进度" name="process">
            <a-input v-model:value="cond.process" />
        </a-form-item>
        <a-form-item label="课程状态" name="status">
            <a-input v-model:value="cond.status" />
        </a-form-item>
        <a-form-item label="课程评价" name="judge">
            <a-input v-model:value="cond.judge" />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit"> 确定 </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import {modal} from '~/common/mixin';

const props = defineProps({
    reocrd: {
        type: Object,
        default: () => ({})
    },
    ...modal
});

const cond = ref(props.reocrd);

const onOk = () => emit('ok');
const onCancel = () => emit('cancel');
const onFinish = (values) => {
    props.close(values)
};
</script>

<style scoped></style>
