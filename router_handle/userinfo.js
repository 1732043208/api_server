// 导入数据库操作模块
const db = require('../db')
// 导入 bcryptjs 
const bcrypt = require('bcryptjs')
// 获取用户信息接口函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户基本信息的处理函数
    const sqlStr = `select id,username,nickname,email,user_pic from ev_users where id=?`
    db.query(sqlStr, req.user.id, (err, results) => {
        //1. 执行 sql 语句失败
        if (err) return res.cc(err)
        // 2.执行 sql 语句成功，但是查询到的数据条数不为1
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 3.将用户信息响应给客户端
        res.send({
            status: 200,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}
// 更新用户信息接口函数
exports.updateUserInfo = (req, res) => {
    const sqlStr = `update ev_users set ? where id=?`
    db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        // 执行 SQL语句 失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但影响行数不为1
        if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户信息成功！', 200)
    })
}

// 重置密码接口函数
exports.updatePassword = (req, res) => {
    const passwordInfo = req.body
    const sqlStr = `select * from ev_users where id=?`
    // 查询当前账号密码与前端传的旧密码是否一致
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (bcrypt.compareSync(passwordInfo.oldPwd, results[0].password)) {
            const newPassword = bcrypt.hashSync(passwordInfo.newPwd, 10)
            // 更新新密码
            const sqlStr = `update ev_users set password=? where id=?`
            db.query(sqlStr, [newPassword, req.user.id], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('密码重置失败！')
                res.cc('密码重置成功！', 200)
            })
        } else {
            res.send('旧密码输入错误！')
        }
    })
}

// 更新用户头像接口函数
exports.updateAvatar = (req, res) => {
    // 1.定义更新头像的 SQL 语句
    const sqlStr = `update ev_users set user_pic=? where id=?`
    // 2.调用 db.query() 执行 SQL 语句
    db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更换头像失败！')
        res.cc('更换头像成功！', 200)
    })
}
