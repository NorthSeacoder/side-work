<template>
    <page-wrapper title="资料管理">
        <a-card>
            <section mb-20px>
                <a-form :model="cond" name="form" layout="inline" autocomplete="off">
                    <a-form-item label="资料标题" name="title">
                        <a-input v-model:value="cond.title" />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit"> 查询 </a-button>
                        <a-button mx type="primary" @click="onEditItem()">新建</a-button>
                    </a-form-item>
                </a-form>
            </section>

            <a-table :columns="columns" :data-source="data" />
        </a-card>
    </page-wrapper>
</template>

<script setup lang="ts">
import {PageWrapper} from '~/common/components/Page';
import {columns, Params} from './constant/options';
import EditModal from './modal/edit-form.vue';
interface FormState {
    title: string;
}
//form
const cond = reactive<FormState>({
    title: ''
});
const instance = getCurrentInstance();

const onEditItem = async (item: Params = {}) => {
    const res = await instance.proxy.$modal.open(EditModal);
    console.log(res);
};

//table
const data = reactive([]);
</script>

<style scoped></style>
