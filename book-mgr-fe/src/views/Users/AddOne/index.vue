<template>
  <div>
    <a-modal
      title="添加一个用户"
      :visible="show"
      @ok="submit"
      @cancel="close"
    >
      <a-form :label-col="{span: 6}">
        <a-form-item label="账户">
          <a-input v-model:value="addForm.account" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-model:value="addForm.password" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="addForm.character">
            <a-select-option 
              v-for="item in characterInfo"
              :key="item._id"
              :value="item_id"
            >{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue'
  import { user } from '@/service'
  import { result, clone } from '@/helpers/utils'
  import { message } from 'ant-design-vue'
  import store from '@/store'

  const defaultFormData = {
    account: '',
    password: '',
    character: ''
  }

  const props = defineProps({
    show: {
      type: Boolean,
      required: false
    }
  })

  const emits = defineEmits(['update:show', 'getList'])

  
  const close = () => {
    emits('update:show', false)
  }

  const { characterInfo } = store.state
  const addForm = ref(clone(defaultFormData))
  addForm.value.character = characterInfo[1]._id

  const submit = async () => {
    const form = clone(addForm.value)
    const res = await user.add(form.account, form.password, form.character)

    result(res)
      .success((d, data) => {
        // 清空表单
        Object.assign(addForm.value, defaultFormData)
        message.success(d.msg)
        close()

        emits('getList')
      })
  }

</script>