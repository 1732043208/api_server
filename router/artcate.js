// 文章分类的路由模块
const express = require('express')
const router = express.Router()

// 导入函数处理模块
const artcate_handle = require('../router_handle/artcate')

// 1.导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2.导入需要的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类列表数据的路由
router.get('/cates', artcate_handle.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handle.addArticleCates)

// 根据Id删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handle.deleteCateById)

// 根据Id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handle.getArtCateById)

// 根据 Id 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handle.updateCateById)

module.exports = router