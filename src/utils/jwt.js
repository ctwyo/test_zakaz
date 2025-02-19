import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET; // Ключ для Access Token
const REFRESH_SECRET = process.env.REFRESH_SECRET; // Ключ для Refresh Token

// 🔹 Генерация токенов
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username }, // Payload
    ACCESS_SECRET,
    { expiresIn: "15m" } // Время жизни
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    REFRESH_SECRET,
    { expiresIn: "7d" } // Время жизни
  );

  return { accessToken, refreshToken };
};

// 🔹 Проверка Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null; // Токен недействителен
  }
};

// 🔹 Проверка Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
