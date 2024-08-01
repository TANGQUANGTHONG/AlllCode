var express = require('express');
var router = express.Router();
var productsModel = require('../model/product');


/**
 * @swagger
 * /product/add_products:
 *   post:
 *     summary: thêm sản phẩm mới
 *     responses:
 *       200:
 *         description: thêm sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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
