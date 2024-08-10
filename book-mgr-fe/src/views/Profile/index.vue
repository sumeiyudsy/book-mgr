<template>
    <a-card title="修改密码">
        <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="原始密码">
                <a-input type="password" v-model:value="form.oldPassword" />
            </a-form-item>
            <a-form-item label="新密码">
                <a-input type="password" v-model:value="form.newPassword" />
            </a-form-item>
            <a-form-item label="确认新密码">
                <a-input type="password" v-model:value="form.confirmNewPassword" />

                <div style="margin-top: 24px;">
                    <a-button type="primary" @click="resetPassword">修改</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-card>
      
  </template>
  
  <script setup>
    import { ref } from 'vue'
    import { profile } from '@/service'
    import { result } from '@/helpers/utils'
    import { message } from 'ant-design-vue'
  
    const form = ref({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const resetPassword = async () => {
        if (form.value.newPassword !== form.value.confirmNewPassword) {
            message.error('两次输入密码不同')
            return
        }

        const res = await profile.resetPassword(
            form.value.newPassword,
            form.value.oldPassword
        )

        result(res)
            .success(({ msg }) => {
                message.success(msg)
                form.value.newPassword = ''
                form.value.oldPassword = ''
                form.value.confirmNewPassword = ''
            })
    }
  </script>
  
  <style lang="scss" scoped>
    .ml-10 {
      margin-left: 10px;
    }
  </style>
  