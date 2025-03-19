import request from '../utils/request';

// 定义接口返回类型
interface LoginResponse {
    code: number;
    message: string;
    data: {
        token: string;
        userInfo: {
            username: string;
            role: string;
            [key: string]: any;
        };
    };
}

interface RegisterResponse {
    code: number;
    message: string;
    data: {
        username: string;
    };
}

interface RegisterParams {
    username: string;
    password: string;
    email: string;
}

// 用户相关接口
export const userApi = {
    // 登录
    login: (data: { username: string; password: string }) => {
        return request({
            url: '/api/user/login',
            method: 'post',
            data
        });
    },
    // 注册
    register: (data: RegisterParams) => {
        return request({
            url: '/api/user/register',
            method: 'post',
            data
        });
    },
    // 获取用户信息
    getUserInfo: () => {
        return request({
            url: '/api/user/info',
            method: 'get'
        });
    },
    // 获取用户列表
    getUserList: (params: { page: number; size: number }) => {
        return request({
            url: '/api/user/list',
            method: 'get',
            params
        });
    }
};

// 权限相关接口
export const permissionApi = {
    // 获取权限列表
    getPermissionList: () => {
        return request({
            url: '/api/permission/list',
            method: 'get'
        });
    }
};

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
