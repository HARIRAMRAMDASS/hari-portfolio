const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (adminId) => {
  return jwt.sign({ userId: adminId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    const token = generateToken(admin._id);
    res.status(201).json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(admin._id);
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
