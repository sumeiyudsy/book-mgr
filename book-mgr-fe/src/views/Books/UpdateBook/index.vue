<template>
  <div>
    <a-modal
      title="修改书籍"
      :visible="show"
      @ok="submit"
      @cancel="close"
    >
      <a-form :label-col="{span: 6}">
        <a-form-item label="书名">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number :min="0" :max="999999" v-model:value="editForm.price" />
        </a-form-item>
        <a-form-item label="作者">
          <a-input v-model:value="editForm.author" />
        </a-form-item>
        <a-form-item label="出版日期">
          <a-date-picker v-model:value="editForm.publishDate" />
        </a-form-item>
        <a-form-item label="分类">
          <a-input v-model:value="editForm.classify" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  import { book } from '@/service'
  import { result } from '@/helpers/utils'
  import { message } from 'ant-design-vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { formatTimestamp } from '@/helpers/utils'

  const props = defineProps({
    show: {
      type: Boolean,
      required: false
    },
    book: {
      type: Object
    },
  })

  const emits = defineEmits(['update:show', 'update: updateEdit'])

  let editForm = ref({
    name: '',
    price: 0,
    author: '',
    publishDate: 0,
    classify: ''
  })

  const submit = async () => {
    const res = await book.update({
      id: props.book._id,
      ...editForm.value,
      publishDate: editForm.value.publishDate.valueOf()
    })

    result(res)
      .success(({ data, msg }) => {
        message.success(msg)
        emits('update:updateEdit', data)
        close()
      })
  }

  const close = () => {
    emits('update:show', false)
  }

  watch(
    () => props.book,
    (val, old) => {
      editForm.value.name = val.name
      editForm.value.price = val.price
      editForm.value.author = val.author
      editForm.value.publishDate = dayjs(formatTimestamp(val.publishDate), 'YYYY/MM/DD')
      editForm.value.classify = val.classify
    }
  )
  
</script>