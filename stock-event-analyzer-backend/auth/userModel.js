const bcrypt = require('bcryptjs');
const db = require('../database/init');

class User {
  // Create a new user
  static async create(username, email, password) {
    return new Promise((resolve, reject) => {
      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }

        // Insert user into database
        const stmt = db.prepare(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`);
        stmt.run([username, email, hashedPassword], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              username,
              email,
              created_at: new Date().toISOString()
            });
          }
        });
        stmt.finalize();
      });
    });
  }

  // Find user by username
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User; 