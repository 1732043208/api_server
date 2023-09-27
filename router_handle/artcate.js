// 导入数据库操作模块
const db = require('../db')

// 获取文章分类列表数据
exports.getArticleCates = (req, res) => {
    const sqlStr = `select * from ev_article_cate where is_delete=0`
    db.query(sqlStr, (err, results) => {
        // 1.执行 SQL 语句失败
        if (err) return res.cc(err)
        console.log(results)
        res.send({
            status: 200,
            messgae: '获取文章分类成功！',
            data: results
        })
    })
}

// 新增文章分类
exports.addArticleCates = (req, res) => {
    // 1.定义查重的 SQL 语句
    const sqlStr = `select * from ev_article_cate where name=? or alias=?`
    // 2.执行查重的 SQL 语句
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
        // 3. 判断是否执行 SQL 语句失败
        if (err) return res.cc(err)
        // 4.1 判断数据的 length
        if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
        // 4.2 length 等于 1 的三种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与分类别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO: 分类名称和分类别名都可用，执行添加的动作
        const sqlStr = `insert into ev_article_cate set ?`
        // 执行插入文章分类的 SQL 语句
        db.query(sqlStr, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.send('新增文章分类成功！')
        })
    })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 定义标记删除的 SQL 语句
    const sqlStr = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功', 200)
    })
    res.send('ok')
}

// 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    const sqlStr = `select * from ev_article_cate where id=?`
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({ status: 200, message: '获取文章分类成功！', data: results[0] })
    })
}

// 根据 ID 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    const sqlStr = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    db.query(sqlStr, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO:分类名称和分类别名都可用，执行添加的动作
        const sqlStr = `update ev_article_cate set ? where id=?`
        db.query(sqlStr, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            res.cc('更新文章分类成功', 200)
        })
    })
}