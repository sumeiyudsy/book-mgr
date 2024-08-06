<template>
    <a-card title="重置密码申请列表" v-only-admin>
  
      <a-table :dataSource="list" :columns="columns" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'createdAt'">
            <span>{{ formatTimestamp(record.meta.createdAt) }}</span>
          </template>
          <template v-if="column.title === '操作'">
            <a-button
                size="small"
                type="primary"
                @click="changeStatus(record, 2)"
            >重置</a-button>
            <a-button
                size="small"
                @click="changeStatus(record, 3)"
            >忽略</a-button>
          </template>
        </template>
      </a-table>
  
      <flex-end>
        <a-pagination
          style="margin: 24px;"
          v-model:current="curPage"
          :total="total"
          :pageSize="20"
          @change="setPage"
        />
      </flex-end>
    </a-card>
  
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { resetPassword } from '@/service'
    import { result, formatTimestamp } from '@/helpers/utils'
    import FlexEnd from '@/components/FlexEnd'
    import { message } from 'ant-design-vue'
  
    const columns = [
      {
        title: '账户',
        dataIndex: 'account'
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt'
      },
      {
        title: '操作',
        dataIndex: 'actions'
      }
    ]
    
    const list = ref([])
    const total = ref(0)
    const curPage = ref(1)
  
    const getList = async () => {
      const res = await resetPassword.list(curPage.value, 20)
  
      result(res)
        .success(({data: { list: resList, total: resTotal } }) => {
          list.value = resList
          total.value = resTotal
        })
    }

    const changeStatus = async ({ _id }, status) => {
      const res = await resetPassword.updateStatus(_id, status)

      result(res)
        .success(({ msg }) => {
          message.success(msg)
          getList()
        })
    }
    
    const setPage = (page) => {
      curPage.value = page
      getList()
    }
  
    onMounted(() => {
        getList()
    })
  
  </script>
  
  <style lang="scss" scoped>
  </style>
  