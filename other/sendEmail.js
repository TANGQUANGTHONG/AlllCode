const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail() {
    // Tạo transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'quangthong2808@gmail.com',
            pass: 'mydpzxmqpahgdeko'
        }
    });

    // Đọc nội dung tệp HTML
    let htmlContent = fs.readFileSync('email_template.html', 'utf-8');

    // Cấu hình email
    let mailOptions = {
        from: 'quangthong2808@gmail.com',  
        to: 'qthong2k4@gmail.com', 
        subject: 'Chào mừng bạn đến với dịch vụ của chúng tôi!',
        html: htmlContent
    };

    // Gửi email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi: ' + info.response);
    } catch (error) {
        console.error('Lỗi khi gửi email: ' + error);
    }
}

sendEmail();
