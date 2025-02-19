"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
  CircularProgress,
} from "@mui/material";
import CategoryButton from "./components/CategoryButton";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useCart } from "./components/CartContext";
import { useUser } from "./components/UserContext";
import Script from "next/script";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, setUser } = useUser();
  const { cart, addToCart, removeFromCart, totalItems } = useCart();

  const categories = ["РМСК", "КСК", "КСО", "РМК", "ВСО", "ТПГ"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: window.Telegram.WebApp.initData }),
        });
        const result = await res.json();

        if (result.success) {
          setUser(result.user);
          console.log(user);
        }
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
      }
    };

    fetchUser();
  }, [setUser]);

  const handleCategorySelect = (category) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <div className={styles.page}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?56"
        strategy="beforeInteractive"
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="sticky">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>

            {loading ? ( // Проверяем, загружаем ли мы данные о пользователе
              <CircularProgress color="inherit" />
            ) : user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" sx={{ marginRight: 2 }}>
                  {user.username}
                </Typography>
                <Image
                  src={user.photoUrl}
                  alt="Avatar"
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                />
              </Box>
            ) : (
              <Typography variant="h6" fontSize={16}>
                Незвестный курьер
              </Typography>
            )}

            <IconButton color="inherit" onClick={toggleCart}>
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <Box display="flex" flexDirection="column" mb={3}>
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                onClick={() => handleCategorySelect(category)}
                isSelected={selectedCategory === category}
              />
            ))}
          </Box>

          {selectedCategory && (
            <ProductList
              category={selectedCategory}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
            />
          )}
        </Box>

        <Cart open={isCartOpen} onClose={toggleCart} />
      </Box>
    </div>
  );
}
