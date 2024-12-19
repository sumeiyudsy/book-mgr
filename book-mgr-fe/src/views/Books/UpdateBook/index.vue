<template>
  <div>
    <a-modal
      title="修改书籍"
      :visible="show"
      @ok="submit"
      @cancel="close"
    >
      <a-form
        ref="formRef"
        :model="editForm"
        :rules="rules"
        :label-col="{span: 6}"
      >
        <a-form-item has-feedback label="书名" name="name">
          <a-input v-model:value="editForm.name" allowClear />
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number :min="0" :max="999999" v-model:value="editForm.price" />
        </a-form-item>
        <a-form-item has-feedback label="作者" name="author">
          <a-input v-model:value="editForm.author" allowClear />
        </a-form-item>
        <a-form-item has-feedback label="图书编号" name="bookNo">
          <a-input v-model:value="editForm.bookNo" allowClear />
        </a-form-item>
        <a-form-item label="出版社">
          <a-input v-model:value="editForm.publish" allowClear />
        </a-form-item>
        <a-form-item label="出版日期">
          <a-date-picker v-model:value="editForm.publishDate" allowClear />
        </a-form-item>
        <a-form-item label="分类" name="classify">
          <a-select v-model:value="editForm.classify" allowClear>
            <a-select-option 
              v-for="item in bookClassify"
              :key="item._id"
              :value="item._id"
            >{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, ref, defineProps, defineEmits, watch } from 'vue'
  import { book } from '@/service'
  import { result } from '@/helpers/utils'
  import { message } from 'ant-design-vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { formatTimestamp } from '@/helpers/utils'
  import store from '@/store'

  const { bookClassify } = store.state

  const props = defineProps({
    show: {
      type: Boolean,
      required: false
    },
    book: {
      type: Object
    },
  })

  const emits = defineEmits(['update:show', 'updateEdit'])

  const formRef = ref()
  let editForm = reactive({
    name: '',
    price: 0,
    author: '',
    publishDate: 0,
    classify: '',
    bookNo: '',
    publish: ''
  })
  
  const rules = {
    name: [
      {
        required: true,
        message: '请输入书名',
        trigger: 'change'
      },
      {
        min: 1,
        max: 20,
        message: '书名不能超过20字',
        trigger: 'change'
      }
    ],
    author: [
      {
        required: true,
        message: '请输入作者',
        trigger: 'change'
      },
      {
        min: 1,
        max: 20,
        message: '作者不能超过20字',
        trigger: 'change'
      }
    ],
    bookNo: [
      {
        required: true,
        message: '请输入图书编号',
        trigger: 'change'
      },
      {
        min: 1,
        max: 20,
        message: '图书编号不能超过20字',
        trigger: 'change'
      }
    ],
    classify: [
      {
        required: true,
        message: '请选择图书分类',
        trigger: 'change'
      }
    ]
  }

  const submit = async () => {
    formRef.value.validate().then(async () => {
      const res = await book.update({
        id: props.book._id,
        ...editForm,
        publishDate: editForm.publishDate.valueOf()
      })

      result(res)
        .success(({ data, msg }) => {
          message.success(msg)
          emits('updateEdit', data)
          close()
          formRef.value.clearValidate()
        })
    })
  }

  const close = () => {
    emits('update:show', false)
  }

  watch(
    () => props.book,
    (val, old) => {
      editForm.name = val.name
      editForm.price = val.price
      editForm.author = val.author
      editForm.bookNo = val.bookNo
      editForm.publish = val.publish
      editForm.publishDate = dayjs(formatTimestamp(val.publishDate), 'YYYY/MM/DD')
      editForm.classify = val.classify
    }
  )
  
</script>