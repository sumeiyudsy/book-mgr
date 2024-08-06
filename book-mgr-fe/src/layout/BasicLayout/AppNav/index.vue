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
          <span> <MailOutlined /> <span>{{ item.title }}</span></span>
        </template>
        <a-menu-item
          v-for="(child) in item.children"
          :key="child.url"
          @click="to(child.url)"
        >
          {{ child.title }}
        </a-menu-item>
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