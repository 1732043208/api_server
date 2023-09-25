// 导入数据库连接对象
const db = require('../db/index')
// 导入 bcryptjs 
const bcrypt = require('bcryptjs')

// 注册新用户的处理函数
exports.register = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    console.log(userinfo)
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空！')
    }
    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 判断用户名是否被占用
        if (results.length > 0) {
            return res.cc("用户名被占用，请更换其他用户名！")
        } else {
            // 调用 bcrypt.hashSync() 对密码进行加密
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)
            // 定义插入新用户的 SQL 语句
            const sqlStr = 'insert into ev_users set ?'
            db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) return res.cc(err)
                // 判断影响行数是否为 1
                if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
                res.send({ status: 200, message: '注册成功！' })
            })
            // TODO：用户名可以使用
        }
    })
}
exports.login = (req, res) => {
    res.send('login OK')
}