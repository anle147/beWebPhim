const { poolPromise } = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const pool = await poolPromise;

    // Kiểm tra username đã tồn tại chưa
    const checkUser = await pool.request()
      .input("Username", username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới
    await pool.request()
      .input("Username", username)
      .input("PasswordHash", hashedPassword)
      .input("Email", email || null)
      .input("Role", "user") // mặc định role là user
      .input("CreatedAt", new Date())
      .query(`
        INSERT INTO Users (Username, PasswordHash, Email, Role, CreatedAt)
        VALUES (@Username, @PasswordHash, @Email, @Role, @CreatedAt)
      `);

    res.status(201).json({
      message: "Đăng ký thành công 🎉",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};