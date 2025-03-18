<template>
  <a-card v-only-admin :title="props.simple ? '最近添加的图书' : ''">
    <h2 v-if="!props.simple">图书列表</h2>

    <a-divider v-if="!props.simple" />

    <space-between>
      <div class="search">
        <a-input-search
          v-model:value="keyword"
          placeholder="根据书名搜索"
          enter-button
          @search="onSearch"
        />
        <a
          v-if="isSearch"
          href="javascript:;"
          class="back"
          @click="clearSearch"
        >清空搜索</a>
      </div>

      <div>
        <a-button v-if="!props.simple" v-only-admin @click="add">添加一条</a-button>

        <a-upload
          class="ml-10"
          action="http://localhost:3000/upload/file"
          :headers="headers"
          @change="onUploadChange"
        >
          <a-button type="primary" v-only-admin>上传 EXCEL 添加</a-button>
        </a-upload>
      </div>
      
    </space-between>
    <a-divider />

    <a-table
      :dataSource="list"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'publishDate'">
          <span>{{ formatTimestamp(text) }}</span>
        </template>
        <template v-if="column.dataIndex === 'classify'">
          <span>{{ getBookClassify(text) }}</span>
        </template>
        <template v-if="column.dataIndex === 'borrowed'">
          <span>{{ formatBorrowed(text) }}</span>
        </template>
        <template v-if="column.dataIndex === 'ordered'">
          <span>{{ formatOrdered(text) }}</span>
        </template>
        <!-- <template v-if="column.dataIndex === 'count'">
          <a href="javascript:;" @click="editCount('IN_COUNT', record)">入库 </a>
          <span>{{ text }}</span>
          <a href="javascript:;" @click="editCount('OUT_COUNT', record)"> 出库</a>
        </template> -->
        <template v-if="column.title === '操作'">
          <a-button
            type="link"
            href="javascript:;"
            v-only-admin
            @click="toDetail(record)"
          >详情 </a-button>
          <a-button
            type="link"
            v-only-admin
            href="javascript:;"
            @click="update(record)"
          >编辑</a-button>
          <a-popconfirm placement="leftTop" ok-text="确定" cancel-text="取消" @confirm="remove(record)">
            <template #title>
              <p>确定删除 《{{ record.name }}》 吗？</p>
            </template>
            <a-button :disabled="record.borrewed" type="link" href="javascript:;" v-only-admin>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <flex-end v-if="!props.simple" style="margin-top: 24px;">
      <a-pagination
        v-model:current="curPage"
        :total="total"
        :pageSize="10"
        @change="setPage"
      />
    </flex-end>

  </a-card>

  <add-one
    v-model:show="show"
    @getList="getList"
  />

  <update-book
    v-model:show="showUpdateModel"
    :book="curEditBook"
    @updateEdit="updateCurBook"
  />

  <edit-stock
    v-model:showStock="showStock"
    :stockType="stockType"
    :stockData="stockData"
    @onSuccess="onSuccess"
  />

</template>

<script setup>
  import SpaceBetween from '@/components/SpaceBetween'
  import FlexEnd from '@/components/FlexEnd'
  import AddOne from './AddOne'
  import EditStock from './EditStock'
  import UpdateBook from './UpdateBook'
  import { ref, defineProps, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { message } from 'ant-design-vue'
  import { result } from '@/helpers/utils'
  import { book } from '@/service'
  import { formatTimestamp } from '@/helpers/utils'
  import { getBookClassify } from '@/helpers/book'
  import { getHeaders } from '@/helpers/request'

  const headers = getHeaders()

  const props = defineProps({
    simple: {
      type: Boolean,
      required: false
    }
  })

  const show = ref(false)

  const add = () => {
    show.value = true
  }

  const columns = [
    {
      title: '书名',
      dataIndex: 'name'
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    // {
    //   title: '库存',
    //   dataIndex: 'count'
    // },
    {
      title: '价格(元)',
      dataIndex: 'price'
    },
    {
      title: '出版日期',
      dataIndex: 'publishDate'
    },
    // {
    //   title: '分类',
    //   dataIndex: 'classify'
    // },
    {
      title: '出版社',
      dataIndex: 'publish'
    },
    {
      title: '是否借阅',
      dataIndex: 'borrowed'
    },
    {
      title: '是否预约',
      dataIndex: 'ordered'
    },
    {
      title: '图书编号',
      dataIndex: '_id'
    }
  ]

  if (!props.simple) {
    columns.push({
      title: '操作'
    })
  }
  
  const list = ref([])
  let curPage = ref(1)
  let total = ref(0)
  let keyword = ref()
  let isSearch = ref(false)
  
  const getList = async () => {
    const res = await book.list({
      page: curPage.value,
      keyword: keyword.value
    })
    result(res)
      .success(({ data }) => {
        const { list: l, total: t } = data
        list.value = l
        total.value = t
      })
  }

  onMounted(async () => {
    getList()
  })

  const setPage = (page) => {
    curPage.value = page
    getList()
  }

  const onSearch = () => {
    isSearch.value = !!keyword.value
    getList()
  }

  const clearSearch = () => {
    isSearch.value = false
    keyword.value = ''
    getList()
  }

  // 删除 
  const remove = async ({ _id }) => {

    const res = await book.remove(_id)

    result(res)
      .success(({ msg }) => {
        message.success(msg)
        getList()
      })
  }

  // 详情
  const router = useRouter()
  const toDetail = async (record) => {
    router.push(`/books/${record._id}`)
  }
  
  // 编辑
  let showUpdateModel = ref(false)
  let curEditBook = ref({})

  const update = async (record) => {
    showUpdateModel.value = true
    curEditBook.value = record
  }

  const showStock = ref(false)
  const stockType = ref('')
  const stockData = ref({})

  const editCount = (type, record) => {
    showStock.value = true
    stockType.value = type
    stockData.value = record
  }

  const onSuccess = () => {
    getList()
  }

  const updateCurBook = (newDate) => {
    Object.assign(curEditBook.value, newDate)
  }
  
  const onUploadChange = ({ file }) => {
    if (file.response) {
      result(file.response)
        .success(async (key) => {
          const { data } = await book.addMany(key)
          message.success(`成功添加 ${data.data} 本书`)

          getList()

        })
    }
  }
  
  const formatBorrowed = (val) => {
    return val ? '已借阅' : '未借阅'
  }

  const formatOrdered = (val) =>  {
    return val ? '已预约' : '未预约'
  }
  
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>