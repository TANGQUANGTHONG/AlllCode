// Các module cần thiết
const express = require('express');
const router = express.Router();
const modelCate = require('../model/category');
const modelProd = require('../model/productAPI.js');
const User = require('../model/user.js')

// GET trang chủ
router.get('/', async (req, res, next) => {
  try {
    const searchQuery = req.query.search || '';
    const _list = await modelProd.find({ name: { $regex: searchQuery, $options: 'i' } }).populate("category");
    res.render('index', { title: "Quản lý sản phẩm", list: _list, searchQuery });
  } catch (error) {
    next(error);
  }
});

// GET trang thêm sản phẩm
router.get('/add', async (req, res, next) => {
  try {
    const listCate = await modelCate.find();
    res.render('add', { listCate });
  } catch (error) {
    next(error);
  }
});

// POST thêm sản phẩm
router.post('/add-product', async (req, res, next) => {
  try {
    const { name, price, quantity, image, category } = req.body;
    const newItem = { name, price, quantity, image, category };
    await modelProd.create(newItem);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// GET trang sửa sản phẩm
router.get('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await modelProd.findById(id);
    const listCate = await modelCate.find();
    res.render('edit', { product, listCate });
  } catch (error) {
    next(error);
  }
});

// POST sửa sản phẩm
router.post('/edit-product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, image, category } = req.body;
    await modelProd.findByIdAndUpdate(id, { name, price, quantity, image, category });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// GET xóa sản phẩm
router.get('/delete/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await modelProd.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

//đăng ký
router.get('/register', (req, res) => {
  res.render('register');
});

// POST đăng ký
router.post('/register', async (req, res, next) => {
  try {
    const { UserName, PassWord } = req.body;
    const newUser = new User({ UserName, PassWord });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    next(error);
  } 
});

// GET trang đăng nhập
router.get('/login', (req, res) => {
  res.render('login');
});

// POST đăng nhập
router.post('/login', async (req, res, next) => {
  try {
    const { UserName, PassWord } = req.body;
    const user = await User.findOne({ UserName });
    if (user && await bcrypt.compare(PassWord, user.PassWord)) {
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;
