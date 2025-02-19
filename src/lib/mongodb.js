import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("❌ Ошибка: Добавь MONGO_URI в .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Для разработки используем глобальное подключение
  if (!global._mongoClientPromise) {
    console.log("🔹 Инициализируем MongoDB в режиме разработки...");
    client = new MongoClient(uri); // Убираем устаревшие опции
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // В продакшене всегда создаем новый клиент
  console.log("🔹 Инициализируем MongoDB в режиме продакшена...");
  client = new MongoClient(uri); // Убираем устаревшие опции
  clientPromise = client.connect();
}

console.log("✅ Подключение к MongoDB инициализировано!");

export default clientPromise;
