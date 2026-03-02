const { poolPromise } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const pool = await poolPromise;

    // Kiểm tra username hoặc email đã tồn tại chưa
const checkUser = await pool.request()
  .input("Username", username)
  .input("Email", email)
  .query(`
    SELECT Username, Email 
    FROM Users 
    WHERE Username = @Username OR Email = @Email
  `);

    if (checkUser.recordset.length > 0) {
    const existingUser = checkUser.recordset[0];

    if (existingUser.Username === username) {
        return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại",
        });
    }

    if (existingUser.Email === email) {
        return res.status(400).json({
        message: "Email đã tồn tại",
        });
    }
    }

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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const pool = await poolPromise;

    // Tìm user theo username
    const result = await pool.request()
      .input("Username", username)
      .query(`
        SELECT UserID, Username, PasswordHash, Role
        FROM Users
        WHERE Username = @Username
      `);

    if (result.recordset.length === 0) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    const user = result.recordset[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
        role: user.Role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Đăng nhập thành công 🎉",
      token,
      user: {
        id: user.Id,
        username: user.Username,
        role: user.Role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

exports.profile = (req, res) => {
  res.json({
    message: "Đây là route đã đăng nhập",
    user: req.user,
  });
};