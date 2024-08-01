var express = require('express');
var router = express.Router();
var upload = require('../other/Upload');
var productModel = require('../model/API');
var sendMail = require('../config');
var fs = require('fs');
var nodemailer = require('nodemailer');


var List = [
  {
    "mssv": 1,
    "name": "thong",
    "lop": "A01",
    "diemTrungBinh": 7.5
  },
  {
    "mssv": 2,
    "name": "thong",
    "lop": "A01",
    "diemTrungBinh": 8.5
  },
  {
    "mssv": 3,
    "name": "nguyen",
    "lop": "MD18401",
    "diemTrungBinh": 9.2
  }
];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(List);
});

// Thêm sinh viên
router.post('/add_sinhvien', function (req, res, next) {
  const { mssv, name, lop, diemTrungBinh } = req.body;
  var item = { mssv: mssv, name: name, lop: lop, diemTrungBinh: diemTrungBinh };
  List.push(item);
  res.status(200).json(List);
});

// Xóa sinh viên
router.delete('/delete/:mssv', function (req, res, next) {
  const { mssv } = req.params;
  var index = List.findIndex(p => p.mssv == mssv);
  if (index !== -1) {
    List.splice(index, 1);
    res.json(List);
  } else {
    res.status(404).json({ error: 'Không tìm thấy sinh viên' });
  }
});

// Chỉnh sửa thông tin sinh viên
router.post('/edit_sinhvien', function (req, res, next) {
  const { mssv, name, lop, diemTrungBinh } = req.body;
  var item = List.find(p => p.mssv == mssv);
  if (item) {
    item.name = name;
    item.lop = lop;
    item.diemTrungBinh = diemTrungBinh;
    res.json(List);
  } else {
    res.status(404).json({ error: 'Không tìm thấy sinh viên' });
  }
});

// Xem chi tiết sinh viên
router.get('/detail2/:mssv', function (req, res, next) {
  const { mssv } = req.params;
  var item = List.find(p => p.mssv == mssv);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Không tìm thấy sinh viên' });
  }
});

// Lấy danh sách các sinh viên có điểm trung bình từ 6.5 đến 8.0
router.get('/diemTrungBinh/6.5-8.0', function (req, res, next) {
  var result = List.filter(p => p.diemTrungBinh >= 6.5 && p.diemTrungBinh <= 8.0);
  res.json(result);
});

// Lấy danh sách các sinh viên thuộc lớp MD18401 và có điểm trung bình lớn hơn 9
router.get('/lop/MD18401/diemTrungBinh/9', function (req, res, next) {
  var result = List.filter(p => p.lop === 'MD18401' && p.diemTrungBinh > 9);
  res.json(result);
});

// Sắp xếp danh sách sinh viên theo điểm trung bình
router.get('/sort/diemTrungBinh', function (req, res, next) {
  var result = List.slice().sort((a, b) => b.diemTrungBinh - a.diemTrungBinh);
  res.json(result);
});

// Tìm ra sinh viên có điểm trung bình cao nhất thuộc lớp MD18401
router.get('/topStudent/MD18401', function (req, res, next) {
  var md18401Students = List.filter(p => p.lop === 'MD18401');
  var topStudent = md18401Students.reduce((max, student) => (student.diemTrungBinh > max.diemTrungBinh ? student : max), md18401Students[0]);
  res.json(topStudent);
});







    
//localhost:3000/users/add
router.post('/add_product', async function(req, res, next){
  const {name, price, quality, type} = req.body;

  const newUser = {name, price, quality, type};

  try {
      const createdUser = await productModel.create(newUser);  
      res.status(201).json(createdUser);
  } catch (error) {
      res.status(500).json({"status": false, "message":"Thất bại", "error": error});
  }
});

/* lấy tất cả sản phẩm*/
//http://localhost:3000/users/list
router.get('/list', async function(req, res, next) {
try{
  const product = await productModel.find();
  res.status(200).json(product);
}catch(error){
  res.status(500).json({"status": false, "message":"Thất bại", "error": error});
}
});

// Lấy thông tin sản phẩm theo ID
router.get('/id', async function(req, res, next) {
try {
  const product = await productModel.findById(req.params.id);
  res.status(200).json(product);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
});

//lấy tất cả sản phẩm có tên và giá
router.get('/name_price', async function(req, res, next){
try {
  const product = await productModel.find({}, 'name price');
  res.status(200).json(product);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
});


//lấy sản phẩm có giá lớn hơn 1000
router.get('/get_price_gt_1000', async function(req, res, next){
try {
  const products = await productModel.find({ price: { $gt: 1000 } }, 'price');
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
});

//Lấy thông tin các sản phẩm thuộc loại 'Bánh'
router.get('/get_type_banh', async function (req, res, next){
try {
  const products = await productModel.find({type:{$eq : "banh"}}, 'type');
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({"status ": false, "message": "that bai ", "error":error});
}
});


// Đếm số lượng sản phẩm trong mỗi loại
router.get('/count_by_type', async function (req, res, next) {
try {
  const products = await productModel.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
});

//Lấy thông tin sản phẩm có số lượng ít hơn 10
router.get('/get_quality_less_10', async function(req, res, next){
try {
  const products = await productModel.find({quality: { $lt : 10}}, 'quality');
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
})

//Cập nhật giá của sản phẩm theo ID, với giá người dùng truyền vào
//:id thay bằng id của sản phẩm
router.put('/update_price/:id', async function(req, res, next) {
try {
  const { price } = req.body;
  const { id } = req.params;

  // Kiểm tra xem giá có được truyền vào hay không
  if (price === undefined) {
    return res.status(400).json({ "status": false, "message": "Giá mới chưa được cung cấp" });
  }

  // Tìm và cập nhật sản phẩm theo ID
  const updatedProduct = await productModel.findByIdAndUpdate(
    id, 
    { price: price }, 
    { new: true }
  );

  // Kiểm tra xem sản phẩm có tồn tại hay không
  if (!updatedProduct) {
    return res.status(404).json({ "status": false, "message": "Không tìm thấy sản phẩm với ID cung cấp" });
  }

  res.status(200).json(updatedProduct);
} catch (error) {
  res.status(500).json({ "status": false, "message": "Thất bại", "error": error });
}
});

//Xóa sản phẩm theo ID
router.delete('/delete/:id', async function (req, res, next){
const { id } = req.params;

try {
  const deletedProduct = await productModel.findByIdAndDelete(id);

  if (!deletedProduct) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  }

  res.json({ message: 'Xóa sản phẩm thành công', deletedProduct });
} catch (error) {
  res.status(500).json({ error: 'Lỗi khi xóa sản phẩm', details: error.message });
}
});

//Lấy các sản phẩm có giá trong khoảng từ 500 đến 1500
router.get('/get_product_500_to_1500', async function(req, res, next){
try {
  const products = await productModel.find({price:{$gt:500 , $lt:1500}}, 'price');
  res.status(200).json(products);
} catch (error) {
  res.status(404).json({ error: 'Không có sản phẩm nào', details: error.message });
}
});

//Lấy tên và số lượng của các sản phẩm có số lượng lớn hơn 20
router.get('/get_quality_20', async function(req, res, next){
try {
  const products = await productModel.find({quality:{$gt:20}}, 'name quality ');
  res.status(200).json(products);
} catch (error) {
  res.status(404).json({ error: 'Không có sản phẩm nào', details: error.message });
}
});

router.get('/get_name_have_iphone', async function(req, res, next){
try {
  const products = await productModel.find({ name: { $regex: 'phone', $options: 'i' } });
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({ error: 'Lỗi khi lấy sản phẩm', details: error.message });
}
});

//lấy sản phẩm có giá đắt nhất
router.get('/most_expensive_product', async function(req, res, next){
try {
  const mostExpensiveProduct = await productModel.findOne().sort({ price: -1 });
  res.status(200).json(mostExpensiveProduct);
} catch (error) {
  res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm đắt nhất', details: error.message });
}
});

//lấy sản phẩm có giá rẻ nhất
router.get('/most_cheap_products', async function(req, res, next){
try {
  const mostExpensiveProduct = await productModel.findOne().sort({ price: +1 });
  res.status(200).json(mostExpensiveProduct);
} catch (error) {
  res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm đắt nhất', details: error.message });
}
});

//Lấy giá trung bình của các sản phẩm
router.get('/average_price', async function(req, res, next){
try {
  const averagePrice = await productModel.aggregate([
    { $group: { _id: null, average: { $avg: "$price" } } }
  ]);

  // Kiểm tra xem có sản phẩm nào không
  if (averagePrice.length > 0) {
    res.status(200).json({ averagePrice: averagePrice[0].average });
  } else {
    res.status(404).json({ error: 'Không có sản phẩm nào' });
  }
} catch (error) {
  res.status(500).json({ error: 'Lỗi khi tính giá trung bình', details: error.message });
}
});




//localhost:3000/users/edit
// router.post('/edit_product', async function(req, res, next){
//   try{
//     const {id, name, email, password} = req.body;

//     const userEdit = await productModel.findById(id);

//     if(userEdit){
//       userEdit.name = name ? name : userEdit.name;
//       userEdit.email = email ? email : userEdit.email;
//       userEdit.password = password ? password : userEdit.password;

//       await userEdit.save();

//       res.status(200).json({"status": true, "message":"Thành công"});
//     }else{
//       res.status(400).json({"status": false, "message":"Thất bại"});
//     }

//   }catch(error){
//     res.status(500).json({"status": false, "message":"Thất bại", "error": error});
//   }
// });

//localhost:3000/users/delete?id=abc


//upload image
router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });

//uploads nhiều image
    router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
               return res.json({ status: 0, link : [] }); 
            } else {
              const url = [];
              for (const singleFile of files) {
                url.push(`http://192.168.1.13:3000/images/${singleFile.filename}`);
              }
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : [] });
        }
    });


//gửi mail
// router.post("/sendmail", async function(req, res, next){
//   try{
//     const {to, subject, content} = req.body;

//     const mailOptions = {
//       from: "TestMail <quangthong2808@gmail.com>",
//       to: to,
//       subject: subject,
//       html: content
//     };
//     await sendMail.transporter.sendMail(mailOptions);
//     res.json({ status: 1, message: "Gửi mail thành công"});
//   }catch(err){
//     res.json({ status: 0, message: "Gửi mail thất bại"});
//   }
// });

// Endpoint gửi email
router.post('/send-email', async (req, res) => {
  const { to, subject } = req.body;

  // Tạo transporter
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'quangthong2808@gmail.com',
          pass: 'mydpzxmqpahgdeko'
      }
  });

  // Đọc nội dung tệp HTML
  let htmlContent = fs.readFileSync('./other/email_template.html', 'utf-8');

  let mailOptions = {
      from: 'quangthong2808@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent
  };

  try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email đã được gửi: ' + info.response);
      res.status(200).send('Email đã được gửi');
  } catch (error) {
      console.error('Lỗi khi gửi email: ' + error);
      res.status(500).send('Lỗi khi gửi email');
  }
});





module.exports = router;
