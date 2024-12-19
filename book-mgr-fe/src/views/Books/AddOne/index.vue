<template>
  <div>
    <a-modal
      title="添加书籍"
      :visible="show"
      @ok="submit"
      @cancel="close"
    >
      <a-form
        ref="formRef"
        :model="addForm"
        :rules="rules"
        :label-col="{span: 6}"
      >
        <a-form-item has-feedback label="书名" name="name">
          <a-input v-model:value="addForm.name" allowClear />
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number :min="0" :max="999999" :precision="2" v-model:value="addForm.price" />
        </a-form-item>
        <a-form-item has-feedback label="作者" name="author">
          <a-input v-model:value="addForm.author" allowClear />
        </a-form-item>
        <a-form-item has-feedback label="图书编号" name="bookNo">
          <a-input v-model:value="addForm.bookNo" allowClear />
        </a-form-item>
        <a-form-item label="出版社">
          <a-input v-model:value="addForm.publish" allowClear />
        </a-form-item>
        <a-form-item label="出版日期">
          <a-date-picker v-model:value="addForm.publishDate" allowClear />
        </a-form-item>
        <a-form-item has-feedback label="分类" name="classify">
          <a-select v-model:value="addForm.classify" allowClear>
            <a-select-option 
              v-for="item in bookClassify"
              :key="item._id"
              :value="item._id"
            >{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="库存" name="count">
          <a-input-number :min="0" :max="999999" :precision="0" v-model:value="addForm.count" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, ref, defineProps, defineEmits } from 'vue'
  import { book } from '@/service'
  import { result, clone } from '@/helpers/utils'
  import { message } from 'ant-design-vue'
  import store from '@/store'

  const { bookClassify } = store.state
  const defaultFormData = {
    name: '',
    price: 0,
    author: '',
    publishDate: 0,
    classify: '',
    count: 0,
    bookNo: '',
    publish: ''
  }
  const formRef = ref()
  const addForm = reactive(clone(defaultFormData))


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

  const props = defineProps({
    show: {
      type: Boolean,
      required: false
    }
  })

  const emits = defineEmits(['update:show', 'getList'])

  addForm.classify = bookClassify[0]?._id

  const submit = () => {
    formRef.value.validate().then(async () => {
      const form = clone(addForm)
      form.publishDate = addForm.publishDate.valueOf()
      const res = await book.add(form)

      result(res)
        .success((d, data) => {
          // 清空表单
          Object.assign(addForm, defaultFormData)
          message.success(d.msg)
          emits('getList')
          formRef.value.clearValidate()
        })
    })
  }

  const close = () => {
    emits('update:show', false)
  }
</script>