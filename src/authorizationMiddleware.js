const jwt = require('jsonwebtoken');

const authControl = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }
    const userData = jwt.verify(token, process.env.JWT_KEY);
    req.user = userData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'User is not authorized' });
  }
};

module.exports = authControl;
