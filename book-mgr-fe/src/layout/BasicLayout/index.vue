<template>
  <div class="basic-layout">
    <div class="app-header">
      <div class="left">
        <img src="" />
        <div class="title">图书管理系统系统</div>
      </div>
      <div class="right">
        <div class="hello-msg">你好，{{ userInfo.account }}</div>
        <div class="logout" @click="logout">退出</div>
      </div>
    </div>
    <div class="app-header-placleholder"></div>
    <div class="app-content">
      <div class="left">
        <app-nav />
      </div>
      <div class="right">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppNav from './AppNav/index.vue'
import { setToken } from '@/helpers/token'
import store from '@/store'

const { userInfo } = store.state

const logout = () => {
  setToken('')
  window.location.href = '/'
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>