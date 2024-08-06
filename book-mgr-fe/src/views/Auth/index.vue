<template>
  <div class="auth">
    <div class="bg"></div>
    <div class="title-info">
      <img src="" alt="" class="image">
      <h2 class="title">图书管理系统后台</h2>
    </div>

    <div class="form">
      <a-tabs>
        <a-tab-pane key="1" tab="登录">
          <div class="item">
            <a-input
              v-model:value="loginForm.account"
              size="large"
              placeholder="账号"
            >
              <template v-slot:prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="item">
            <a-input
              v-model:value="loginForm.password"
              size="large"
              placeholder="密码"
            >
              <template v-slot:prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="item">
            <a href="JavaScript:;" @click="forgetPwd">忘记密码</a>
          </div>
          <div class="item">
            <a-button size="large" type="primary" @click="login">登录</a-button>
          </div>
        </a-tab-pane>

        <a-tab-pane key="2" tab="注册">
          <div class="item">
            <a-input
              v-model:value="regForm.account"
              size="large"
              placeholder="账号"
            >
              <template v-slot:prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="item">
            <a-input
              v-model:value="regForm.password"
              size="large"
              placeholder="密码"
            >
              <template v-slot:prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="item">
            <a-input
              v-model:value="regForm.inviteCode"
              size="large"
              placeholder="邀请码"
            >
              <template v-slot:prefix>
                <MailOutlined />
              </template>
            </a-input>
          </div>
          <div class="item">
            <a-button size="large" type="primary" @click="register">注册</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>

  <forget-password
    v-model:showModal="showModal"
  />
</template>

<script setup>
  import { ref } from 'vue'
  import { auth } from '@/service'
  import { message } from 'ant-design-vue'
  import { result } from '@/helpers/utils'
  import { getCharacterInfoById } from '@/helpers/character'
  import store from '@/store'
  import { useRouter} from 'vue-router'
  import { setToken } from '@/helpers/token'
  import forgetPassword from './ForgetPassword/index'

  const router = useRouter()
  // 数据源
  const loginForm = ref({
    account: '',
    password: ''
  })

  const login = async () => {
    if (loginForm.value.account === '') {
      message.info('请输入账户')
      return
    }
    if (loginForm.value.password === '') {
      message.info('请输密码')
      return
    }
    const res = await auth.login(loginForm.value.account, loginForm.value.password)
    result(res)
      .success(({ msg, data: { user, token }}) => {
        message.success(msg)

        store.commit('setUserInfo', user)
        store.commit('setUserCharacter', getCharacterInfoById(user.character))

        setToken(token)
        router.replace('/books')
      })
  }

  // 注册
  const regForm = ref({
    account: '',
    password: '',
    inviteCode: ''
  })

  const register = async () => {
    if (regForm.value.account === '') {
      message.info('请输入账户')
      return
    }
    if (regForm.value.password === '') {
      message.info('请输密码')
      return
    }
    if (regForm.value.inviteCode === '') {
      message.info('请输邀请码')
      return
    }
    const res = await auth.register(
      regForm.value.account,
      regForm.value.password,
      regForm.value.inviteCode
    )

    result(res)
      .success((data) => {
        message.success(data.msg)
      })
  }

  // 忘记密码
  let showModal = ref(false)
  const forgetPwd = async () => {
    showModal.value = true
  }
</script>

<style lang="scss" scpoed>
  @import './index.scss';
</style>