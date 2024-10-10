var express = require('express');
var router = express.Router();
const Case = require('../model/API'); 

router.get('/list/:status', async (req, res) => {
    try {
        const status = parseInt(req.params.status);
        if (isNaN(status)) {
            return res.status(400).json({ message: 'Status phải là một số' });
        }
        const cases = await Case.find({ status: status });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.post('/add', async (req, res) => {
  const { licenseplate, information, status } = req.body;

  if (!licenseplate ) {
      return res.status(400).json({ message: 'licenseplate ' });
  }
  if ( !information) {
    return res.status(400).json({ message: ' information là bắt buộc' });
}

  const statusValue = (status === undefined || status === null || status === '') ? 0 : parseInt(status);

  try {
      const newCase = new Case({
          licenseplate,
          information,
          status: statusValue
      });
      await newCase.save();
      res.status(201).json({ message: 'Thêm thông tin thành công' });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
  }
});


module.exports = router;
