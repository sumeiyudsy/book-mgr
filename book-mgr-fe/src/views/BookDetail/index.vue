<template>
  <div>
    <a-card>
      <space-between>
        <h2>{{ detailInfo.name }}</h2>
        <div>
          <a-button v-only-admin size="small" type="primary" @click="showUpdateModel = true">编辑</a-button>
          &nbsp;
          <a-button v-only-admin size="small" type="primary" danger @click="remove">删除</a-button>
        </div>
      </space-between>

      <a-divider />

      <div class="base-info">
        <div class="items">
          <div class="item">
            <div class="title">价格</div>
            <div class="content">{{ detailInfo.price }}</div>
          </div>
          <div class="item">
            <div class="title">作者</div>
            <div class="content">{{ detailInfo.author }}</div>
          </div>
          <div class="item">
            <div class="title">分类</div>
            <div class="content">{{ detailInfo.classify }}</div>
          </div>
        </div>
        <div class="items">
          <div class="item">
            <div class="title">出版日期</div>
            <div class="content">{{ formatTimestamp(detailInfo.publishDate) }}</div>
          </div>
        </div>
      </div>
    </a-card>

    <a-card class="log" title="出入库日志">
      <template #extra>
        <span>
          <a href="javascript:;" @click="logFilter('IN_COUNT')">
            <CheckOutlined v-if="curLogType == 'IN_COUNT'" />
            入库日志
          </a>
        </span>
        <span style="margin-left: 12px;">
          <a href="javascript:;" @click="logFilter('OUT_COUNT')">
            <CheckOutlined v-if="curLogType == 'OUT_COUNT'" />
            出库日志
          </a>
        </span>
      </template>

      <a-table
        bordered
        :pagination="false"
        :data-source="log"
        :columns="columns"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.title === '操作时间'">
            {{ formatTimestamp(record.meta.createdAt) }}
          </template>
        </template>
      </a-table>

      <space-between>
        <div />
        <a-pagination
          style="margin-top: 24px;"
          v-model:current="logCurPage"
          :total="logTotal"
          :page-size="10"
          @change="setLogPage"
        />
      </space-between>
    </a-card>
  </div>

  <update-book
    v-model:show="showUpdateModel"
    :book="detailInfo"
    @updateEdit="updateCurBook"
  />
</template>

<script setup>
  import UpdateBook from '@/views/Books/UpdateBook'
  import SpaceBetween from '@/components/SpaceBetween'
  import { useRoute, useRouter } from 'vue-router'
  import { CheckOutlined } from '@ant-design/icons-vue'
  import { ref, onMounted } from 'vue'
  import { book, inventoryLog } from '@/service'
  import { result } from '@/helpers/utils'
  import { formatTimestamp } from '@/helpers/utils'
  import { message } from 'ant-design-vue'

  const route = useRoute()
  const router = useRouter()

  const { id } = route.params
  const detailInfo = ref({})

  const getDetail = async () => {
    const res = await book.detail(id)

    result(res)
      .success(( { data } ) => {
        detailInfo.value = data
      })
  }

  // 获取出库入库
  const log = ref([])
  const logTotal = ref(0)
  const logCurPage = ref(1)
  const curLogType = ref('IN_COUNT')
  const columns = [
    {
      title: '数量',
      dataIndex: 'num'
    },
    {
      title: '操作时间'
    }
  ]

  const getInventoryLog = async () => {
    const res = await inventoryLog.list(curLogType.value, logCurPage.value, 10)

    result(res)
      .success(({ data: { list, total} }) => {
        log.value = list
        logTotal.value = total
      })
  }

  const showUpdateModel = ref(false)
  const updateCurBook = (book) => {
    Object.assign(detailInfo.value, book)
  }

  const remove = async () => {
    const res = await book.remove(id)

    result(res)
      .success(({ msg }) => {
        message.success(msg)

        router.replace('/books')
      })
  }

  const setLogPage = (page) => {
    logCurPage.value = page

    getInventoryLog()
  }

  const logFilter = (type) => {
    logCurPage.value = 1
    curLogType.value = type

    getInventoryLog()
  }

  onMounted(() => {
    getDetail()
    getInventoryLog()
  })

</script>

<style lang="scss" scoped>
  .base-info {
    .items {
      display: flex;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .item {
        flex: 1;
        display: flex;

        .title {
          width: 70px;
          font-weight: bold;
          color: rgba($color: #000000, $alpha: 0.7);
        }
        .content{}
      }
    }
  }

  .log {
    margin-top: 24px;
  }
</style>
