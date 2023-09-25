// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()
const joi = require('@hapi/joi')
// 解析body参数
app.use(express.json())
// 导入并配置 cors中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 在路由的之前，封装res.cc函数
app.use((req, res, next) => {
    // status 默认值为500，表示失败的情况
    // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 500) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 未知的错误
    res.cc(err)
})
app.listen(3007, () => {
    console.log('服务器启动成功~http://127.0.0.1:3007')
})