<template>
    <div>
      <a-modal
        title="输入账号发起申请，管理员会审核"
        :visible="showModal"
        :destroyOnClose="true"
        @ok="submit"
        @cancel="close"
      >
        <a-input v-model:value="account" />
      </a-modal>
    </div>
  </template>
  
  <script setup>
    import { ref, defineProps, defineEmits } from 'vue'
    import { resetPassword } from '@/service'
    import { result} from '@/helpers/utils'
    import { message } from 'ant-design-vue'
  
  
    const props = defineProps({
      showModal: {
        type: Boolean,
        required: false
      }
    })
  
    const emits = defineEmits(['onSuccess', 'update:showModal'])
    const account = ref('')
  
    const submit = async () => {
      const res = await resetPassword.add(account.value)
  
      result(res)
        .success(({ msg }) => {
          message.success(msg)
          close()
        })
    }
  
    const close = () => {
      emits('update:showModal', false)
    }
  </script>