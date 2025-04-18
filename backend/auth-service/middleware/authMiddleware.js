import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Please login and try again.",
    });
  }

  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token!" });
    }

    req.user = decoded;
    next();
  });
}

export default authMiddleware;
