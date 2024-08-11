<template>
    <a-spin :spinning="loading">
        <a-card>
            <div class="list">
                <div class="item">
                    <div class="count">共 {{ baseInfo.total.bookTotal }} 本</div>
                    <div class="title">书籍</div>
                </div>
                
                <div class="item">
                    <div class="count">共 {{ baseInfo.total.userTotal }} 位</div>
                    <div class="title">用户</div>
                </div>
                
                <div class="item">
                    <div class="count">共 {{ baseInfo.total.logTotal }} 条</div>
                    <div class="title">日志</div>
                </div>
            </div>
        </a-card>
    </a-spin>

    <div class="table-lists">
        <div class="left">
            <Boook simple />
        </div>
        <div class="right">
            <User simple />
        </div>
    </div>
      
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { dashboard } from '@/service'
    import { result } from '@/helpers/utils'
    import Boook from '@/views/Books/index.vue'
    import User from '@/views/Users/index.vue'

    const loading = ref(true)
    const baseInfo = ref({
        total: {
            logTotal: 0,
            userTotal: 0,
            bookTotal: 0
        }
    })
    const getList = async () => {
        loading.value = true
        const res = await dashboard.baseInfo()
        loading.value = false


        result(res)
            .success(({ data }) => {
                baseInfo.value = data
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
    .list {
        display: flex;

        .item {
            flex: 1;

            .title {
                color: #666;
            }

            .count {
                font-weight: bold;
                font-size: 20px;
                color: black;
            }
        }
    }
    .table-lists {
        display: flex;
        margin-top: 24px;

        .left {
            flex: 1;
            margin-right: 12px;
        }

        .right {
            flex: 1;
            margin-left: 12px;
        }
    }
  </style>
  