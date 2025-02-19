import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    console.log("Подключение к MongoDB...");
    const client = await clientPromise;
    console.log("Подключено к MongoDB:", client);

    const db = client.db("sample_mflix"); // или используй правильное имя базы данных
    console.log("Получена база данных:", db);

    const users = await db.collection("users").find({}).toArray();
    console.log("Полученные пользователи:", users);

    return Response.json(users);
  } catch (error) {
    console.error("Ошибка при подключении или запросе:", error);
    return Response.json(
      { error: "Ошибка подключения к MongoDB" },
      { status: 500 }
    );
  }
}
