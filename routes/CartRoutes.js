const express = require('express');
const router = express.Router();
const Cart = require('../model/CartModel');
const Product = require('../model/product');
const UserModel = require('../model/user');
const jwt = require('jsonwebtoken');

// Middleware để xác thực người dùng
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);
    req.user = await UserModel.findById(decodedToken.userId);
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

// Lấy giỏ hàng của người dùng
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: error.message });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error: error.message });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm trong giỏ hàng', error: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error: error.message });
  }
});

module.exports = router;
