<template>
  <div>
    <a-menu
      style="width: 100%"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      v-for="(item) in menu"
      :key="item.url"
      v-only-admin="item.onlyAdmin"
      @click="handleClick"
    >
      <a-sub-menu
        v-if="item.children"
      >
        <template #title>
          <span> <MailOutlined /> <span></span></span>
        </template>
        <!-- <a-menu-item-group key="g1">
          <template #title> <QqOutlined /> <span>item 2</span></template>
          <a-menu-item key="1">1</a-menu-item>
          <a-menu-item key="2">2</a-menu-item>
        </a-menu-item-group> -->
      </a-sub-menu>
      <a-menu-item v-else :key="item.url" @click="to(item.url)">
        <span>{{ item.title }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import menu from '@/config/menu'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const openKeys = ref([])
  const selectedKeys = ref([])

  onMounted(() => {
    selectedKeys.value = [route.path]
  })

  const to = (url) => {
    router.push(url)
  }

</script>