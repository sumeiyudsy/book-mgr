<template>
  <a-card>
    <h2>意见建议</h2>

    <a-divider />

    <space-between>
      <div class="search">
        <a-input-search
          v-model:value="keyword"
          placeholder="根据用户名搜索"
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

      <a-button @click="showAddModel = true">添加一条</a-button>
    </space-between>

    <a-divider />

    <a-table :dataSource="list" :columns="columns" bordered :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'time'">
          <span>{{ formatTimestamp(record.time) }}</span>
        </template>
      </template>
    </a-table>

    <flex-end>
      <a-pagination
        v-if="!isSearch"
        style="margin: 24px;"
        v-model:current="curPage"
        :total="total"
        :pageSize="10"
        @change="setPage"
      />
    </flex-end>
  </a-card>

  <a-modal
    v-model:visible="showAddModel"
    title="提交意见建议"
    @ok="addView"
  >
    <a-textarea v-model:value="addForm.view" show-count :maxlength="200" />
    <br />
    <a-radio v-model:checked="addForm.anonymous">匿名提交</a-radio>
  </a-modal>

</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { userView } from '@/service'
  import { result, formatTimestamp } from '@/helpers/utils'
  import SpaceBetween from '@/components/SpaceBetween'
  import FlexEnd from '@/components/FlexEnd'
  import { message } from 'ant-design-vue'
  import store from '@/store'

  const columns = [
    {
      title: '用户名',
      dataIndex: 'uName'
    },
    {
      title: '意见',
      dataIndex: 'view'
    },
    {
      title: '创建时间',
      dataIndex: 'time'
    }
  ]

  const keyword = ref('')
  const isSearch = ref(false)
  const onSearch = () => {
    isSearch.value = !!keyword.value
    getList()
  }

  const clearSearch = () => {
    isSearch.value = false
    keyword.value = ''
    getList()
  }

  const list = ref([])
  const total = ref(0)
  const curPage = ref(1)

  const getList = async () => {
    const res = await userView.list(keyword.value, curPage.value, 10)

    result(res)
      .success(({data: { list: resList, total: resTotal } }) => {
        list.value = resList
        total.value = resTotal
      })
  }

  const showAddModel = ref(false)
  const addForm = ref({
    view: '',
    anonymous: false
  })
  const { userInfo } = store.state
  
  const addView = async () => {
    const time = new Date().getTime()
    const userName = addForm.value.anonymous ? '匿名' : userInfo.account
    if (addForm.value.view === '') {
      message.error('请输入意见建议')
      return
    }

    const res = await userView.add(userName, addForm.value.view, time)

    result(res)
      .success((d, data) => {
        addForm.value.view = ''
        addForm.value.anonymous = false

        message.success(d.msg)
        showAddModel.value = false
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

  .search {
    display: flex;
    align-items: center;
  }

  .back {
    width: 100px;
    margin-left: 16px;
    cursor: pointer;
  }
</style>
