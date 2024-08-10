<template>
  <div>
    <a-modal
      title="添加书籍"
      :visible="show"
      @ok="submit"
      @cancel="close"
    >
      <a-form :label-col="{span: 6}">
        <a-form-item label="书名">
          <a-input v-model:value="addForm.name" />
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number :min="0" :max="999999" v-model:value="addForm.price" />
        </a-form-item>
        <a-form-item label="作者">
          <a-input v-model:value="addForm.author" />
        </a-form-item>
        <a-form-item label="出版日期">
          <a-date-picker v-model:value="addForm.publishDate" />
        </a-form-item>
        <a-form-item label="分类">
          <a-select v-model:value="addForm.classify">
            <a-select-option 
              v-for="item in bookClassify"
              :key="item._id"
              :value="item._id"
            >{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="库存">
          <a-input v-model:value="addForm.count" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue'
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
    count: null
  }

  const props = defineProps({
    show: {
      type: Boolean,
      required: false
    }
  })

  const emits = defineEmits(['update:show', 'getList'])

  const addForm = ref(clone(defaultFormData))
  addForm.value.classify = bookClassify[0]?._id

  const submit = async () => {
    const form = clone(addForm.value)
    form.publishDate = addForm.value.publishDate.valueOf()
    const res = await book.add(form)

    result(res)
      .success((d, data) => {
        // 清空表单
        Object.assign(addForm.value, defaultFormData)
        message.success(d.msg)
        emits('getList')
      })
  }

  const close = () => {
    emits('update:show', false)
  }
</script>