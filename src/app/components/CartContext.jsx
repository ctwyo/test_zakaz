"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Контекст корзины
const CartContext = createContext();

// Провайдер для корзины
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []); // Заполняем корзину при монтировании компонента

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]); // Синхронизация с localStorage

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (!newCart[product]) {
        newCart[product] = 1;
      } else {
        newCart[product] += 1;
      }
      console.log("Updated cart:", newCart); // Логирование изменения корзины
      localStorage.setItem("cart", JSON.stringify(newCart)); // Сразу сохраняем в localStorage
      return newCart;
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product] > 1) {
        newCart[product] -= 1;
      } else {
        delete newCart[product];
      }
      console.log("Updated cart:", newCart); // Логирование изменения корзины
      localStorage.setItem("cart", JSON.stringify(newCart)); // Сразу сохраняем в localStorage
      return newCart;
    });
  };

  // Очистка корзины
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  // Вычисляем общее количество товаров
  const totalItems = Object.values(cart).reduce(
    (total, count) => total + count,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, totalItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук для использования корзины
export const useCart = () => useContext(CartContext);
