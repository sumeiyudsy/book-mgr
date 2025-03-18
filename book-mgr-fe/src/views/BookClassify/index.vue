<template>
    <a-card title="图书分类管理" v-only-admin>
  
      <div class="add-wrap">
        <a-input
          v-model:value="title"
          placeholder="输入书籍分类"
        />
        <a-button class="ml-10" type="primary" @click="add">添加</a-button>
      </div>
  
      <a-divider />
  
      <a-table :dataSource="list" :columns="columns" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.title === '操作'">
            <a-button @click="update(record)">修改</a-button>
            <a
              class="delete-btn ml-10"
              href="javascrip: ;"
              type="warn"
              @click="remove(record)"
            > 删除</a>
          </template>
        </template>
      </a-table>
  
    </a-card>

    <a-modal
        v-model:visible="showModal"
        title="修改书籍分类"
        @ok="updateBookClassify"
    >
        <a-input v-model:value="editForm.title"></a-input>
    </a-modal>
  
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { bookClassify } from '@/service'
    import { result } from '@/helpers/utils'
    import { message } from 'ant-design-vue'
    import store from '@/store'
  
    const columns = [
    {
        title: '分类',
        dataIndex: 'title'
      },
      {
        title: '操作',
        dataIndex: 'actions'
      }
    ]
  
    // 列表
    const list = ref([])
    const getList = async () => {
      const res = await bookClassify.list()
  
      result(res)
        .success(({ data }) => {
          list.value = data
          store.commit('setBookClassify', data)
        })
    }
  
    // 添加
    const title = ref('')
    const add = async () => {
      const res = await bookClassify.add(title.value)

      result(res)
        .success(() => {
          message.success(`成功添加`)
          title.value = ''
          getList()
        })
    }
  
    // 删除
    const remove = async ({ _id }) => {
      const res = await bookClassify.remove(_id)
  
      result(res)
        .success(({ msg }) => {
          message.success(msg)
          getList()
        })
    }

    // 修改
    const showModal = ref(false)
    const editForm = ref({
        id: '',
        title: ''
    })
    const update = async ({ _id, title }) => {
        editForm.value.id = _id
        editForm.value.title = title
        showModal.value = true
    }

    const updateBookClassify = async () => {
        const res = await bookClassify.updateTitle(editForm.value.id, editForm.value.title)

        result(res)
        .success(({ msg }) => {
            showModal.value = false
            message.success(msg)
            list.value.forEach(item => {
                if (item._id === editForm.value.id) {
                    item.title = editForm.value.title
                }
            })
        })
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
      width: 200px;
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
  