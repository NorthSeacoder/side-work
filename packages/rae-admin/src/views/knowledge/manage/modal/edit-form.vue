<template>
    <a-form :model="cond" name="form" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
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
    </a-form>
</template>

<script setup lang="ts">
const props = defineProps({
    reocrd: {
        type: Object,
        default: () => ({})
    }
});

const cond = ref(props.reocrd);

const onOk = () => emit('ok');
const onCancel = () => emit('cancel');
</script>

<style scoped></style>
