<template>
  <div>
    <a-spin :spinning="loding">
      <a-card :title="props.simple ? '最近添加的日志' : ''">
        <h2 v-if="!props.simple">操作日志</h2>

        <a-divider v-if="!props.simple" />

        <div>
          <a-table
            :columns="columns"
            :dataSource="list"
            :pagination="false"
            border
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'account'">
                <span>{{ record.user.account }}</span>
              </template>
              <template v-if="column.dataIndex === 'url'">
                <span>{{ record.action }}</span>
              </template>
              <template v-if="column.dataIndex === 'createdAt'">
                <span>{{ formatTimestamp(record.meta.createdAt) }}</span>
              </template>
              <template v-if="column.title === '操作'">
                <a
                  href="javascript:;"
                  @click="remove(record)"
                > 删除</a>
              </template>
            </template>
          </a-table>
        </div>

        <flex-end style="margin-top: 24px;">
          <a-pagination
            v-if="!props.simple"
            v-model:current="curPage"
            :pageSize="20"
            :total="total"
            @change="setPage"
          />
        </flex-end>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup>
  import { ref, defineProps, onMounted } from 'vue'
  import { log } from '@/service'
  import { result, formatTimestamp } from '@/helpers/utils'
  import { getLogInfoByPath } from '@/helpers/log'
  import { message } from 'ant-design-vue'

  import FlexEnd from '@/components/FlexEnd'

  const props = defineProps({
    simple: {
      type: Boolean,
      required: false
    }
  })

  const columns = [
    {
      title: '用户名',
      dataIndex: 'account'
    },
    {
      title: '访问地址',
      dataIndex: 'url'
    },
    {
      title: '记录时间',
      dataIndex: 'createdAt'
    }
  ]

  if (!props.simple) {
    columns.push({
      title: '操作'
    })
  }

  const curPage = ref(1)
  const total = ref(0)
  const list = ref([])
  const loding = ref(true)

  const getList = async () => {
    loding.value = true
    const res = await log.list(curPage.value, 20)
    loding.value = false

    result(res)
      .success(({msg, data: {list: l, total: t} }) => {
        l.forEach(item => {
          item.action = getLogInfoByPath(item.request.url)
        })

        total.value = t
        list.value = l
      })
  }

  const remove = async ({ _id }) => {
    const res = await log.remove(_id)

    result(res)
      .success(({msg}) => {
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