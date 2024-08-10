const Router = require('@koa/router')
const mongoose = require('mongoose')

const BookClassify = mongoose.model('BookClassify')

const router = new Router({
  prefix: '/book-classify',
})

router.get('/list', async (ctx) => {
    const list = await BookClassify
        .find()
        .sort({
            _id: -1
        })
        .exec()

    ctx.body = {
        data: list,
        code: 1,
        msg: '获取列表成功'
    }
    
})

router.post('/add', async (ctx) => {
    const { title } = ctx.request.body

    const one = await BookClassify.findOne({
        title
    }).exec()

    if (one) {
        ctx.body = {
            code: 0,
            msg: '书籍分类已存在'
        }

        return
    }

    const bookClassify = new BookClassify({
        title
    })

    const saved = await bookClassify.save()

    ctx.body = {
        code: 1,
        data: saved,
        msg: '添加成功'
    }

})

router.delete('/:id', async (ctx) => {
    const { id } = ctx.params

    const res = await BookClassify.deleteOne({ _id: id })

    ctx.body = {
        code: 1,
        msg: '删除成功',
        data: res
    }
      
})

router.post('/update/title', async (ctx) => {
    const { id, title } = ctx.request.body

    const one = await BookClassify.findOne({ _id: id })

    if (!one) {
        ctx.body = {
            code: 0,
            msg: '资源不存在'
        }

        return
    }

    one.title = title

    const res = await one.save()

    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: res
    }
})

module.exports = router
