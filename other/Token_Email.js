const jwt = require('jsonwebtoken');
const SECRET_KEY =  crypto.randomBytes(64).toString('hex');
console.log(SECRET_KEY);

// Khi người dùng đăng ký
const emailToken = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
newUser.emailToken = emailToken;
await newUser.save();

// Gửi email xác thực
const verificationUrl = `http://192.168.1.22:3000/users/confirm-email/${emailToken}`;
const emailContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thư chào mừng</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            margin: 0 auto;
            padding: 20px;
            max-width: 600px;
            background-color: #f4f4f4;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Chào mừng bạn đến với dịch vụ của chúng tôi!</h1>
        </div>
        <div class="content">
            <p>Xin chào,</p>
            <p>Chúng tôi rất vui mừng khi bạn đã đăng ký tài khoản của chúng tôi. Chúng tôi cam kết sẽ mang đến cho bạn những trải nghiệm tốt nhất.</p>
            <p>Để bắt đầu, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút dưới đây:</p>
            <a href="${verificationUrl}" class="btn">Xác nhận email</a>
        </div>
        <div class="footer">
            <p>Trân trọng,</p>
            <p>Đội ngũ dịch vụ của chúng tôi</p>
        </div>
    </div>
</body>
</html>
`;

sendEmail(newUser.Email, 'Xác nhận email', emailContent);
