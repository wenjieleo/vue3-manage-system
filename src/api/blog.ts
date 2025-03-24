import request from '../utils/request';

// 博客列表接口参数
interface BlogListParams {
    page: number;
    size: number;
    keyword?: string;
}

// 博客列表返回数据
interface BlogListResponse {
    code: number;
    message: string;
    data: {
        list: BlogItem[];
        total: number;
    };
}

// 博客详情数据
export interface BlogItem {
    id: number;
    title: string;
    author: string;
    content: string;
    createTime: string;
    updateTime: string;
    [key: string]: any;
}

// 博客API
export const blogApi = {
    // 获取博客列表
    getBlogList: (params: BlogListParams) => {
        return request<BlogListResponse>({
            url: '/api/blog/list',
            method: 'get',
            params
        });
    },

    // 获取博客详情
    getBlogDetail: (id: number) => {
        return request<{ code: number; message: string; data: BlogItem }>({
            url: `/api/blog/detail/${id}`,
            method: 'get'
        });
    },

    // 新增博客
    addBlog: (data: Omit<BlogItem, 'id' | 'createTime' | 'updateTime'>) => {
        return request({
            url: '/api/blog/add',
            method: 'post',
            data
        });
    },

    // 编辑博客
    editBlog: (data: BlogItem) => {
        return request({
            url: '/api/blog/edit',
            method: 'put',
            data
        });
    },

    // 删除博客
    deleteBlog: (id: number) => {
        return request({
            url: `/api/blog/delete/${id}`,
            method: 'delete'
        });
    }
}; 