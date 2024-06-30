<template>
  <div>
    <a-modal
      :title="title"
      :visible="showStock"
      :destroyOnClose="true"
      @ok="submit"
      @cancel="close"
    >
      <a-input v-model:value="stock" />
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  import { book } from '@/service'
  import { result} from '@/helpers/utils'
  import { message } from 'ant-design-vue'


  const props = defineProps({
    showStock: {
      type: Boolean,
      required: false
    },
    stockType: {
      type: String
    },
    stockData: {
      type: Object,
      required: {}
    }
  })

  let title = ref('')
  const init = () => {
    let word = '增加'
    if (props.stockType === 'OUT_COUNT') {
      word = '减少'
    }
    title = `要${word}多少库存`
  }

  const emits = defineEmits(['onSuccess', 'update:showStock'])
  const stock = ref('')

  const submit = async () => {
    const res = await book.updateCount({
      id: props.stockData._id,
      num: stock.value,
      type: props.stockType
    })

    let word = '增加'
    if (props.stockType === 'OUT_COUNT') {
      word = '减少'
    }

    result(res)
      .success(() => {
        message.success(`成功${word} ${Math.abs(stock.value)} 本书`)
        emits('onSuccess')
        close()
      })
  }

  const close = () => {
    emits('update:showStock', false)
  }

  watch(
    () => props.showStock,
    val => {
      if (val) {
        init()
      }
    }
  )
</script>