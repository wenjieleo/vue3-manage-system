<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">后台管理系统</div>
            </div>
            <el-form :model="param" :rules="rules" ref="register" size="large">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter="submitForm(register)"
                    >
                        <template #prepend>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="param.email" placeholder="邮箱">
                        <template #prepend>
                            <el-icon>
                                <Email />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(register)">注册</el-button>
                <p class="login-text">
                    已有账号，<el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Register } from '@/types/user';
import { userApi } from '@/api';

interface RegisterInfo {
    username: string;
    password: string;
    email: string;
}

const router = useRouter();
const param = reactive<RegisterInfo>({
    username: '',
    password: '',
    email: ''
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 20,
            message: '用户名长度应在3-20个字符之间',
            trigger: 'blur',
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            min: 6,
            max: 20,
            message: '密码长度应在6-20个字符之间',
            trigger: 'blur',
        }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
};
const register = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
        if (valid) {
            try {
                const res = await userApi.register(param);
                console.log("res6564545>>>", res)
                if (res.code == 200) {
                    ElMessage.success('注册成功，请登录');
                    router.push('/login');
                } else {
                    ElMessage.error(res.message || '注册失败');
                }
            } catch (error) {
                ElMessage.error('注册失败，请稍后重试');
                return false;
            }
        } else {
            ElMessage.error('请填写完整的注册信息');
            return false;
        }
    });
};
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}
</style>
