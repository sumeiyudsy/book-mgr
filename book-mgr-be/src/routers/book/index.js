const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../helpers/utils')
const { loadExcel, getFirstSheet } = require('../../helpers/excel')
const config = require('../../project.config')

const BOOK_CONST = {
  IN: 'IN_COUNT',
  OUT: 'OUT_COUNT'
}

const Book = mongoose.model('Book')
const InventoryLog = mongoose.model('InventoryLog')
const BookClassify = mongoose.model('BookClassify')

const findBookOne = async (id) => {
  const one = await Book.findOne({
    _id: id
  }).exec()

  return one
}

const router = new Router({
  prefix: '/book',
})

router.post('/add', async (ctx) => {
  const { 
    name,
    price,
    author,
    publishDate,
    classify,
    count
   } = getBody(ctx)

   const book = new Book({
    name,
    price,
    author,
    publishDate,
    classify,
    count
   })

   const res = await book.save()

   ctx.body = {
    data: res,
    code: 1,
    msg: '添加成功'
   }
})

router.get('/list', async (ctx) => {
  const {
    keyword = '',
    page = 1,
    size = 10
  } = ctx.query

  const query = {}

  if ( keyword ) {
    query.name = keyword
  }


  const list = await Book
  .find(query)
  .sort({
    _id: -1
  })
  .skip((page - 1) * size)
  .limit(size * 1)
  .exec()

  const total = await Book.countDocuments()

   ctx.body = {
    data: {
      list,
      total
    },
    code: 1,
    msg: '获取列表成功'
   }
})

router.delete('/:id', async (ctx) => {
  const {
    id
  } = ctx.params

  const delMsg = await Book.deleteOne({
    _id: id
  })

  ctx.body = {
    data: delMsg,
    msg: '删除成功',
    code: 1
  }
})

router.post('/update/count', async (ctx) => {
  const {
    id,
    type
  } = ctx.request.body

  let { num } = ctx.request.body

  num = Number(num)

  const book = await findBookOne(id)

  if (!book) {
    ctx.body = {
      code: 0,
      msg: '没有找到书籍'
    }

    return
  }

  // 找到了
  if (type === BOOK_CONST.IN) {
    // 入库
    num = Math.abs(num)
  } else {
    // 出库
    num = -Math.abs(num)
  }

  book.count = book.count + num

  if (book.count < 0)  {
    ctx.body = {
      code: 0,
      msg: '剩下的量不足以出库'
    }
    
    return
  }

  const res = await book.save()

  const log = new InventoryLog({
    num: Math.abs(num),
    type
  })

  await log.save()

  ctx.body = {
    data: res,
    msg: '操作成功',
    code: 1
  }

})

router.post('/update', async (ctx) => {
  const {
    id,
    ...others
  } = ctx.request.body

  const one = await findBookOne(id)

  if (!one) {
    ctx.body = {
      msg: '没有找到书籍',
      code: 0
    }
    return
  }

  const newQuery = {}

  Object.entries(others).forEach(([key, value]) => {
    if (value) {
      newQuery[key] = value
    }
  })

  Object.assign(one, newQuery)

  const res = await one.save()

  ctx.body = {
    code: 1,
    data: res,
    msg: '保存成功'
  }
})

router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params

  const one = await findBookOne(id)

  // 没有找到书籍
  if (!one) {
    ctx.body = {
      code: 0,
      msg: '没有找到书籍'
    }
    return
  }

  ctx.body = {
    code: 1,
    data: one,
    msg: '查询成功'
  }

})


router.post('/addMany', async (ctx) => {
  const { fileKey = '' } = ctx.request.body

  const path = `${config.UPLOAD_DIR}/${fileKey}`

  const excel = loadExcel(path)

  const sheet = getFirstSheet(excel)

  const arr = []

  for(let i = 0; i < sheet.length; i++) {
    let record = sheet[i]
    const [name, price, author, publishDate, classify, count] = record

    let classifyId = classify

    let one = await BookClassify.findOne({ title: classify }).exec()

    console.log('one', one)
    if (one) {
      classifyId = one._id
    }

    arr.push({
      name,
      price,
      author,
      publishDate,
      classify: classifyId,
      count
    })
  }

  await Book.insertMany(arr)

  ctx.body = {
    code: 1,
    msg: '添加成功',
    data: arr.length
  }
})

module.exports = router
