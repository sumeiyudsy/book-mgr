<template>
  <a-card v-only-admin>
    <h2>用户管理</h2>

    <a-divider />

    <space-between>
      <div class="search">
        <a-input-search
          v-model:value="keyword"
          placeholder="根据账户搜索"
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
        <a-button v-if="!props.simple" @click="showAddModel = true">添加用户</a-button>

        <a-upload
          action="http://localhost:3000/upload/file"
          @change="onUploadChange"
        >
          <a-button type="primary">上传 EXCEL 添加</a-button>
        </a-upload>
      </div>
    </space-between>

    <a-divider />

    <a-table :dataSource="list" :columns="columns" bordered :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'createdAt'">
          <span>{{ formatTimestamp(record.meta.createdAt) }}</span>
        </template>
        <template v-if="column.dataIndex === 'character'">
          <a href="javascript:;" @click="onEdit(record)">
            <EditOutlined />
          </a>
          {{ getCharacterInfoById(record.character).title }}
        </template>
        <template v-if="column.title === '操作'">
          <a
            href="javascript:;"
            @click="resetPassword(record)"
          >重置密码 </a>
          <a
            href="javascript:;"
            @click="remove(record)"
          > 删除</a>
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

  <add-one
    v-model:show="showAddModel"
    @getList="getUser"
  />

  <a-modal
    v-model:visible="showEditCharacterModal"
    title="修改角色"
    @ok="updateCharacter"
  >
    <a-select
      v-model:value="editForm.character"
      style="width: 220px;"  
    >
      <a-select-option 
        v-for="item in characterInfo"
        :key="item._id"
        :value="item_id"
      >{{ item.title }}</a-select-option>
    </a-select>
  </a-modal>

</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { user } from '@/service'
  import { result, formatTimestamp } from '@/helpers/utils'
  import { getCharacterInfoById } from '@/helpers/character'
  import SpaceBetween from '@/components/SpaceBetween'
  import FlexEnd from '@/components/FlexEnd'
  import { message } from 'ant-design-vue'
  import { EditOutlined } from '@ant-design/icons-vue'
  import AddOne from './AddOne'
  import store from '@/store'

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
      title: '角色',
      dataIndex: 'character'
    },
    {
      title: '操作',
      dataIndex: 'actions'
    }
  ]

  const { characterInfo } = store.state
  const keyword = ref('')
  const isSearch = ref(false)
  const onSearch = () => {
    isSearch.value = !!keyword.value
    getUser()
  }

  const clearSearch = () => {
    isSearch.value = false
    keyword.value = ''
    getUser()
  }

  const list = ref([])
  const total = ref(0)
  const curPage = ref(1)

  const getUser = async () => {
    const res = await user.list(keyword.value, curPage.value, 10)

    result(res)
      .success(({data: { list: resList, total: resTotal } }) => {
        list.value = resList
        total.value = resTotal
      })
  }

  const showAddModel = ref(false)

  const resetPassword = async ({ _id }) => {
    const res = await user.resetPassword( _id )

    result(res)
      .success(({ msg }) => {
        message.success(msg)
      })
  }

  const showEditCharacterModal = ref(false)
  const editForm = ref({
    character: '',
    current: {}
  })
  const onEdit = (record) => {
    showEditCharacterModal.value = true
    editForm.value.character = record.character
    editForm.value.current = record
  }

  const updateCharacter = async () => {
    const res = await user.editCharacter(editForm.value.character, editForm.value.current?._id)
    
    result(res)
      .success(({ msg }) => {
        showEditCharacterModal.value = false
        editForm.value.current.character = editForm.value.character
        message.success(msg)
      })
  }

  const remove = async ({ _id }) => {
    const res = await user.remove(_id)

    result(res)
      .success(({ msg }) => {
        message.success(msg)
        getUser()
      })
  }

  const onUploadChange = ({ file }) => {
    if (file.response) {
      result(file.response)
        .success(async (key) => {

          const res = await user.addMany(key)
        })
    }
  } 
  
  const setPage = (page) => {
    curPage.value = page
    getUser()
  }

  onMounted(() => {
    getUser()
  })

</script>

<style lang="scss" scoped>
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
