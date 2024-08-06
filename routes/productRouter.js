var express = require('express');
var router = express.Router();
var productsModel = require('../model/product');

/**
 * @swagger
 * /product/add_products:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     description: Thêm một sản phẩm mới vào hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của sản phẩm.
 *                 example: Áo thun
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Giá của sản phẩm.
 *                 example: 199000
 *     responses:
 *       201:
 *         description: Thêm sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Trạng thái thành công.
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID của sản phẩm mới.
 *                       example: "641e9b0f1d1d8c2a1f4e9b02"
 *                     name:
 *                       type: string
 *                       description: Tên của sản phẩm.
 *                       example: Áo thun
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: Giá của sản phẩm.
 *                       example: 199000
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Trạng thái thất bại.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 *                   example: Thất bại
 *                 error:
 *                   type: object
 *                   description: Chi tiết lỗi.
 */

/**
 * @swagger
 * /product/get_all_products:
 *   get:
 *     summary: lấy toàn bộ sản phẩm
 *     responses:
 *       200:
 *         description: lấy toàn bộ sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /product/get_product_byID/{id}:
 *   get:
 *     summary: lấy sản phẩm theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: lấy sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/add_products', async function(req, res, next){
  const {name, price, Decription, type, size, image} = req.body;
  const newProducts = {name, price, Decription, type, size, image};
  try {
    const creatProducts = await productsModel.create(newProducts);
    res.status(201).json(creatProducts)
  } catch (error) {
    res.status(500).json({"status": false, "message":"Thất bại", "error": error});
  }
})



router.get('/get_all_products', async function (req, res, next){
  try {
    const product = await productsModel.find()
    res.status(201).json(product)  
  } catch (error) {
    res.status(500).json({"status":  false , "message":"Thất bại","error":error})
  }
  
})

router.get('/get_product_byID/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productsModel.findById(id);

    if (!product) {
      return res.status(404).json({ status: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json({ status: true, product });
  } catch (error) {

    res.status(500).json({ status: false, message: 'Lỗi server', error });
  }
});

module.exports = router;
