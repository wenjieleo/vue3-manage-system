<template>
    <div class="blog-container">
        <!-- 搜索区域 -->
        <div class="search-box">
            <el-form :inline="true" :model="query" class="demo-form-inline">
                <el-form-item label="关键字">
                    <el-input v-model="query.keyword" placeholder="请输入博客标题关键字" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="operation-box">
            <el-button type="primary" @click="handleAdd">新增博客</el-button>
        </div>

        <!-- 表格区域 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                    <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <div class="pagination-box">
            <el-pagination
                v-model:current-page="page.current"
                v-model:page-size="page.size"
                :page-sizes="[10, 20, 30, 50]"
                :total="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { blogApi } from '@/api/blog';

// 定义接口
interface BlogItem {
    id: number;
    title: string;
    author: string;
    createTime: string;
    updateTime: string;
    [key: string]: any;
}

// 查询参数
const query = reactive({
    keyword: ''
});

// 分页参数
const page = reactive({
    current: 1,
    size: 10,
    total: 0
});

// 表格数据
const tableData = ref<BlogItem[]>([]);
const loading = ref(false);

const router = useRouter();

// 获取博客列表
const getBlogList = async () => {
    loading.value = true;
    try {
        const res = await blogApi.getBlogList({
            page: page.current,
            size: page.size,
            keyword: query.keyword
        });
        tableData.value = res.data.list;
        page.total = res.data.total;
    } catch (error) {
        console.error('获取博客列表失败:', error);
        ElMessage.error('获取博客列表失败');
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    page.current = 1;
    getBlogList();
};

// 重置搜索
const resetQuery = () => {
    query.keyword = '';
    handleSearch();
};

// 新增博客
const handleAdd = () => {
    router.push('/blog/addEditBlog');
};

// 编辑博客
const handleEdit = (row: BlogItem) => {
    router.push(`/blog/addEditBlog?id=${row.id}`);
};

// 删除博客
const handleDelete = (row: BlogItem) => {
    ElMessageBox.confirm('确认删除该博客吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await blogApi.deleteBlog(row.id);
            ElMessage.success('删除成功');
            getBlogList();
        } catch (error) {
            console.error('删除博客失败:', error);
            ElMessage.error('删除博客失败');
        }
    });
};

// 分页大小改变
const handleSizeChange = (val: number) => {
    page.size = val;
    getBlogList();
};

// 页码改变
const handleCurrentChange = (val: number) => {
    page.current = val;
    getBlogList();
};

// 页面加载时获取数据
onMounted(() => {
    getBlogList();
});
</script>

<style scoped>
.blog-container {
    padding: 20px;
}

.search-box {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.operation-box {
    margin-bottom: 20px;
}

.pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
