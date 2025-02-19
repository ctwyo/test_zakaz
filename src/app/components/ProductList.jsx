import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Иконка ✅

const ProductList = ({ category, addToCart, removeFromCart, cart }) => {
  const productLists = {
    РМСК: [
      'Монитор 24"',
      "ПК Старшего",
      "МФУ",
      "Мышь",
      "Клава",
      "ИБП",
      "ИБП хвост",
      "Фильтр 3м",
    ],
    КСК: [
      "0509",
      "1750",
      "Сканер",
      "ФР",
      "Mer 221f",
      "ДЯ",
      "ИБП",
      "ИБП хвост",
      "Фильтр 3м",
      "5001",
      "5002",
      'Монитор 19"',
      "HDMI-VGA",
    ],
    КСО: [
      "0509",
      "1750",
      "Сканер",
      "ФР",
      "Mer 221f",
      "ИБП",
      "ИБП хвост",
      "Фильтр 3м",
      "5002",
    ],
    РМК: [
      "Моноблок фронтол",
      "Ключ фронтол",
      "Сканер",
      "ФР",
      "Mer 221f",
      "ДЯ",
      "ИБП",
      "ИБП хвост",
      "Фильтр 3м",
      "5001",
      "5002",
      'Монитор 19"',
    ],
    ВСО: ["1750", "0509", "Mer 221f", "Принтер", "Фильтр 3м", "Oncron"],
    ТПГ: ["ТПГ Бизерба", "ТПГ Терра", "ТПГ Зебра", "ТПГ PC200"],
  };

  const products = category ? productLists[category] : [];

  if (!category) {
    return (
      <Typography variant="h6">
        Выберите категорию для отображения товаров.
      </Typography>
    );
  }

  return (
    <Box sx={{ paddingTop: 0 }}>
      {/* <Typography variant="h6">Список товаров ({category})</Typography> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          marginTop: 2,
          backgroundColor: "#f0f0f0",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {products.map((product) => {
          const isInCart = cart[product] > 0;
          const count = cart[product] || 0;

          return (
            <Box
              key={product}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "black",
                width: "100%",
                padding: "10px",
                backgroundColor: isInCart ? "#e8f5e9" : "#ffffff",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isInCart && <CheckCircleIcon sx={{ color: "#2e7d32" }} />}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isInCart ? "bold" : "normal",
                    color: isInCart ? "#2e7d32" : "inherit",
                  }}
                >
                  {product}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => removeFromCart(product)}
                >
                  -
                </Button>
                <Typography variant="body2">{count}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => addToCart(product)}
                >
                  +
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProductList;
