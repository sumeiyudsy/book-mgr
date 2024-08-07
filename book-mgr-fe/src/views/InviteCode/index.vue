<template>
    <a-card title="邀请码管理" v-only-admin>
  
      <div class="add-wrap">
        <a-input-number
          v-model:value="count"
          :min="1"
          :max="10000"
        />
        <a-button class="ml-10" type="primary" @click="add">添加</a-button>
      </div>
  
      <a-divider />
  
      <a-table :dataSource="list" :columns="columns" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <span>{{ record.user ? '已使用' : '未使用' }}</span>
          </template>
          <template v-if="column.title === '操作'">
            <a
              class="delete-btn"
              href="javascrip: ;"
              type="warn"
              @click="remove(record)"
            > 删除</a>
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
  
    <a-modal
      title="修改角色"
    >
      
    </a-modal>
  
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { inviteCode } from '@/service'
    import { result } from '@/helpers/utils'
    import FlexEnd from '@/components/FlexEnd'
    import { message } from 'ant-design-vue'
  
    const columns = [
    {
        title: '邀请码',
        dataIndex: 'code'
      },
      {
        title: '使用状态',
        dataIndex: 'status'
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
      const res = await inviteCode.list(curPage.value, 20)
  
      result(res)
        .success(({data: { list: resList, total: resTotal } }) => {
          list.value = resList
          total.value = resTotal
        })
    }
  
    const count = ref(1)
    const add = async () => {
      const res = await inviteCode.add(count.value)

      result(res)
        .success(() => {
          message.success(`成功添加 ${count.value} 条邀请码`)
          getList()
        })
    }
  
    const remove = async ({ _id }) => {
      const res = await inviteCode.remove(_id)
  
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
    .ml-10 {
      margin-left: 10px;
    }
    .add-wrap {
      display: flex;
      align-items: center;
    }
    .delete-btn {
      padding: 2px 10px;
      color: #fff;
      letter-spacing: 2px;
      text-align: center;
      background: #f00;
      border-radius: 2px;
    }
  </style>
  