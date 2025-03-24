<template>
    <div class="blog-edit-container">
        <div class="page-header">
            <h2>{{ isEdit ? '编辑博客' : '新增博客' }}</h2>
            <el-button @click="goBack">返回</el-button>
        </div>

        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="100px"
            class="blog-form"
        >
            <el-form-item label="标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入博客标题" />
            </el-form-item>

            <el-form-item label="作者" prop="author">
                <el-input v-model="formData.author" placeholder="请输入作者名称" />
            </el-form-item>

            <el-form-item label="内容" prop="content">
                <div class="editor-container">
                  <editor/>
                    <!-- <v-md-editor
                        v-model="formData.content"
                        height="400px"
                        :disabled="false"
                        :toolbar="{
                            bold: true,
                            italic: true,
                            title: true,
                            strikethrough: true,
                            divider: true,
                            quote: true,
                            unorderedList: true,
                            orderedList: true,
                            taskList: true,
                            divider: true,
                            codeRow: true,
                            code: true,
                            link: true,
                            image: true,
                            table: true,
                            mermaid: true,
                            katex: true,
                            emoji: true,
                            sub: true,
                            sup: true,
                            fullScreen: true
                        }"
                    ></v-md-editor> -->
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { blogApi } from '@/api/blog';
import type { BlogItem } from '@/api/blog';

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 是否是编辑模式
const isEdit = ref(false);

// 表单数据
const formData = reactive<Omit<BlogItem, 'id' | 'createTime' | 'updateTime'>>({
    title: '',
    author: '',
    content: ''
});

// 表单验证规则
const rules: FormRules = {
    title: [
        { required: true, message: '请输入博客标题', trigger: 'blur' },
        { min: 2, max: 100, message: '标题长度在2-100个字符之间', trigger: 'blur' }
    ],
    author: [
        { required: true, message: '请输入作者名称', trigger: 'blur' },
        { min: 2, max: 20, message: '作者名称长度在2-20个字符之间', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入博客内容', trigger: 'blur' },
        { min: 10, message: '内容不能少于10个字符', trigger: 'blur' }
    ]
};

// 获取博客详情
const getBlogDetail = async (id: number) => {
    try {
        const res = await blogApi.getBlogDetail(id);
        Object.assign(formData, res.data);
    } catch (error) {
        console.error('获取博客详情失败:', error);
        ElMessage.error('获取博客详情失败');
    }
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;
    
    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            loading.value = true;
            try {
                if (isEdit.value) {
                    await blogApi.editBlog({
                        ...formData,
                        id: Number(route.query.id)
                    });
                    ElMessage.success('编辑成功');
                } else {
                    await blogApi.addBlog(formData);
                    ElMessage.success('新增成功');
                }
                goBack();
            } catch (error) {
                console.error('保存失败:', error);
                ElMessage.error('保存失败');
            } finally {
                loading.value = false;
            }
        }
    });
};

// 返回列表页
const goBack = () => {
    router.push('/blog');
};

// 页面加载时判断是新增还是编辑
onMounted(() => {
    const id = route.query.id;
    if (id) {
        isEdit.value = true;
        getBlogDetail(Number(id));
    }
});
</script>

<style scoped>
.blog-edit-container {
    padding: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.blog-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
}

.editor-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
</style> 