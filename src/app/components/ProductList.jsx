import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ProductList = ({ category, addToCart, removeFromCart, cart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

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
  };

  const products = category ? productLists[category] : [];

  if (!category) {
    return (
      <Typography variant="h6">
        Выберите категорию для отображения товаров.
      </Typography>
    );
  }

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setIsChecked(false);
  };

  const handleClose = () => setSelectedProduct(null);

  const toggleCheckbox = () => setIsChecked(!isChecked);

  const getCartName = () =>
    isChecked ? `${selectedProduct} (С БП)` : selectedProduct;

  return (
    <Box sx={{ paddingTop: 0 }}>
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
          const isInCart = cart[product] > 0 || cart[`${product} (С БП)`] > 0;
          const count = cart[product] || cart[`${product} (С БП)`] || 0;

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
                cursor: "pointer",
              }}
              onClick={() => handleOpen(product)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product);
                  }}
                >
                  -
                </Button>
                <Typography variant="body2">{count}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  +
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Попап */}
      <Dialog
        open={!!selectedProduct}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedProduct}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={toggleCheckbox} />}
            label="С БП"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => removeFromCart(getCartName())}>-</Button>
          <Typography variant="body1">{cart[getCartName()] || 0}</Typography>
          <Button onClick={() => addToCart(getCartName())}>+</Button>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
