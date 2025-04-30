<template>
  <div>
    <a-menu
      style="width: 100%"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      v-for="(item) in routers"
      :key="item.name"
    >
      <a-sub-menu
        v-if="item.children.length > 0"
        :key="item.name"
      >
        <template #title>
          <span> <MailOutlined /> <span>{{ item.meta.title }}</span></span>
        </template>
        <a-menu-item
          v-for="(child) in item.children"
          :key="child.path"
          @click="to(child.path)"
        >
          {{ child.meta.title }}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item v-else :key="item.path" @click="to(item.path)">
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import menu from '@/config/menu'
  import { useRouter, useRoute } from 'vue-router'
  import { filterRouters, generateMenus } from '@/utils/route'

  const openKeys = ref([])
  const selectedKeys = ref([])
  const route = useRoute()
  selectedKeys.value = [route.path]
  
  const router = useRouter()
  const routers = computed(() => {
    const filterRoutes = filterRouters(router.getRoutes())
    return generateMenus(filterRoutes)    
  })

  const to = (path) => {
    router.push(path)
  }

  watch(
  routers,
  () => {
    if (routers.length) {
      routers.forEach(item => {
        (item.children || []).forEach(child => {
          if (child.path === route.path) {
            openKeys.value = [item.name]
          }
        })
      })
    }
  }
)

</script>