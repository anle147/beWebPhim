const { poolPromise } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const pool = await poolPromise;

    // Kiểm tra username hoặc email đã tồn tại
    const checkUser = await pool.request()
      .input("Username", username)
      .input("Email", email || null)
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

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới
    await pool.request()
      .input("Username", username)
      .input("PasswordHash", hashedPassword)
      .input("Email", email || null)
      .input("Role", "user")
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



// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const pool = await poolPromise;

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

    // 🔥 TẠO TOKEN ĐÚNG UserID
    const token = jwt.sign(
      {
        id: user.UserID,
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
        id: user.UserID,
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



// ================= GET CURRENT USER =================
exports.getMe = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", req.user.id)
      .query(`
          SELECT UserID, Username, Email, Role, CreatedAt, Balance
          FROM Users 
          WHERE UserID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

