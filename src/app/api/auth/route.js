import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { generateTokens } from "../../../utils/jwt";

const getDb = async () => {
  const client = await clientPromise;
  return client.db();
};

export async function POST(req) {
  try {
    console.log("🔍 API вызван: /api/auth");
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username обязателен" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 403 }
      );
    }

    // Генерируем токены
    const { accessToken, refreshToken } = generateTokens(user);

    // Устанавливаем refreshToken в httpOnly cookie
    const response = NextResponse.json({
      message: "Авторизация успешна",
      accessToken,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("❌ Ошибка при авторизации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
