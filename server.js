const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Middleware to parse incoming JSON data
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3001", // Update with your frontend URL
  })
);

// Set up database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a MySQL connection pool
const mysql = require("mysql");
const pool = mysql.createPool(dbConfig);

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  });
};

// API endpoint for user signup
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Perform validation checks
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Hash and salt the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Store the user data in the database
    pool.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(201).json({ message: "User created successfully" });
      }
    );
  });
});

// API endpoint for user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Perform validation checks
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Retrieve the user from the database
  pool.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!match) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a new hashed password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Update the user's password in the database
        pool.query(
          "UPDATE users SET password = ? WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Internal server error" });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: "1h",
            });

            // Send the JWT back to the client
            return res.status(200).json({ message: "Login successful", token });
          }
        );
      });
    });
  });
});


// // API endpoint for forgot password
// app.post("/forgot-password", (req, res) => {
//   const { email } = req.body;

//   // Perform validation checks
//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   // Check if the email exists in the database
//   pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "This email is not registered" });
//     }

//     // Generate OTP
//     const otp = generateOTP();

//     try {
//       // Send OTP email
//       await sendOTPEmail(email, otp);

//       // TODO: Store the OTP in the database for verification
//       pool.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp], (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ message: "Internal server error" });
//         }
//       });

//       return res.status(200).json({ message: "OTP sent to email" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Failed to send OTP email" });
//     }
//   });
// });

// // API endpoint for OTP verification
// app.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   // Retrieve the stored OTP from the database for verification
//   pool.query("SELECT otp FROM otps WHERE email = ?", [email], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "OTP not found" });
//     }

//     const storedOTP = results[0].otp;

//     if (otp !== storedOTP) {
//       return res.status(401).json({ message: "Invalid OTP" });
//     }

//     return res.sendStatus(200);
//   });
// });

// API endpoint for forgot password
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  // Perform validation checks
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if the email exists in the database
  pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "This email is not registered" });
    }

    // Generate OTP
    const otp = generateOTP();

    try {
      // Send OTP email
      await sendOTPEmail(email, otp);

      // TODO: Store the OTP in the database for verification
      pool.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
      });

      return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  });
});

// API endpoint for OTP verification
app.post("/verify-otp/:email", (req, res) => {
  const { email, otp } = req.body;

  console.log('Received email:', email);
  console.log('Received OTP:', otp);

  // TODO: Perform OTP verification logic here
  // Retrieve the stored OTP from the database for verification
  pool.query("SELECT otp FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1", [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    console.log('Database results:', results);

    if (results.length === 0) {
      return res.status(404).json({ message: "OTP not found" });
    }

    const storedOTP = results[0].otp;

    console.log('Stored OTP:', storedOTP);

    if (otp !== storedOTP) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    console.log('OTP verification successful');
    return res.sendStatus(200);
  });
});




// API endpoint for change password
app.post("/change-password/:email", (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  // Perform validation checks
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Hash and salt the new password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Update the user's password in the database
    pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(200).json({ message: "Password changed successfully" });
      }
    );
  });
});


// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  // Only authenticated users will reach this point
  res.json({ message: "Protected route accessed successfully" });
});

// API endpoint for the root path
app.get("/", (req, res) => {
  res.send("Hello, World! I am working fine!");
});

// Handle 404 - Not found
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Send OTP email
const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h1>OTP for Password Reset</h1>
      <p>Your OTP for password reset is <strong>${otp}</strong>.</p>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
