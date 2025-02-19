import { NextResponse } from "next/server";
import { verifyRefreshToken, generateTokens } from "../../../utils/jwt";
import clientPromise from "../../../lib/mongodb";

const getDb = async () => {
  const client = await clientPromise;
  return client.db();
};

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh Token отсутствует" },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Refresh Token недействителен" },
        { status: 403 }
      );
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: decoded.userId });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 403 }
      );
    }

    // Генерируем новый Access Token
    const { accessToken } = generateTokens(user);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("❌ Ошибка при обновлении токена:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
