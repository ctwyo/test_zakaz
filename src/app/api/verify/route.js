import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "../../../lib/mongodb"; // Используем общий clientPromise

const BOT_TOKEN = process.env.BOT_TOKEN;

const a = "1";
const b = "2";

export async function POST(req) {
  try {
    console.log("🔍 API вызван: /api/verify");

    const { initData } = await req.json();
    if (!initData) {
      console.log("❌ Ошибка: initData отсутствует");
      return NextResponse.json(
        { error: "initData is required" },
        { status: 400 }
      );
    }

    if (!BOT_TOKEN) {
      console.log("❌ Ошибка: BOT_TOKEN отсутствует");
      return NextResponse.json(
        { error: "Bot token is missing" },
        { status: 500 }
      );
    }

    // 1️⃣ Проверяем hash
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) {
      console.log("❌ Ошибка: hash отсутствует");
      return NextResponse.json({ error: "Hash is missing" }, { status: 400 });
    }

    params.delete("hash");
    const dataString = [...params.entries()]
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", Buffer.from("WebAppData"))
      .update(BOT_TOKEN)
      .digest();
    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataString)
      .digest("hex");

    if (computedHash !== hash) {
      console.log("❌ Ошибка: Неверный hash");
      return NextResponse.json({ error: "Invalid hash" }, { status: 403 });
    }

    // 2️⃣ Достаём пользователя из initData
    const user = JSON.parse(params.get("user") || "{}");
    console.log("📌 Полученные данные пользователя:", user);

    if (!user || !user.username) {
      console.log("❌ Ошибка: user.username отсутствует");
      return NextResponse.json(
        { error: "User data is invalid" },
        { status: 403 }
      );
    }

    console.log("🔍 Ищем пользователя в MongoDB:", user.username);

    // 3️⃣ Подключаемся к MongoDB через общий клиент
    const client = await clientPromise;
    const db = client.db("sample_mflix"); // Используем базу данных, определенную в clientPromise
    const usersCollection = db.collection("users");

    console.log("🔗 Подключение к MongoDB выполнено успешно");

    const allUsers = await usersCollection.find().toArray(); // Получаем все пользователи

    console.log("📌 Результаты поиска в MongoDB всех users:", allUsers);

    const existingUser = await usersCollection.findOne({
      telegramId: String(user.id),
    });

    console.log("📌 Результат поиска в MongoDB:", existingUser);

    if (existingUser) {
      console.log("✅ Пользователь найден, вход разрешён:", user.username);
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          photoUrl: user.photo_url || "",
        },
      });
    } else {
      console.log("⛔ Пользователь не найден, доступ запрещён:", user.username);
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }
  } catch (error) {
    console.error("❌ Ошибка сервера:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
