import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  console.log("🟡 [API] POST /api/order вызван");

  try {
    // Подключение к базе данных
    console.log("🔹 Подключаемся к MongoDB...");
    const client = await clientPromise;
    console.log("✅ Подключено!");

    const db = client.db("sample_mflix"); // Измени на свою базу, если нужно

    // Получаем данные из запроса
    const { orderDetails, username, userId } = await request.json();
    console.log("📦 Полученные данные:", { orderDetails, username, userId });

    if (!orderDetails || !username || !userId) {
      console.warn("⚠️ Не все данные переданы!");
      return Response.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    // Создаем объект заказа
    const newOrder = {
      orderDetails,
      username,
      userId,
      createdAt: new Date(),
    };

    console.log("📝 Сохраняем заказ в базе...");
    const result = await db.collection("orders").insertOne(newOrder);
    console.log("✅ Заказ успешно добавлен с ID:", result.insertedId);

    return Response.json({
      message: "Заказ успешно добавлен",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Ошибка при подключении или запросе:", error);
    return Response.json(
      { error: "Ошибка при добавлении заказа в базу данных" },
      { status: 500 }
    );
  }
}
