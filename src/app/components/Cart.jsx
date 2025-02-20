import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useCart } from "./CartContext";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useUser } from "./UserContext";

const Cart = ({ open, onClose }) => {
  const { cart, clearCart, totalItems, removeFromCart, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { user, setUser } = useUser();

  const filteredCart = Object.entries(cart).filter(([_, count]) => count > 0);

  useEffect(() => {
    console.log("Cart component updated with cart:", cart);
  }, [cart]);

  const handleAddOrder = async () => {
    setLoading(true);
    setSuccess(false);
    setError(false);

    const orderDetails = Object.entries(cart).map(([product, count]) => ({
      product,
      count,
    }));

    const username = user.username;
    const userId = user.id;

    console.log("Кнопка нажата, отправляем запрос...");
    console.log("Отправляемые данные:", orderDetails);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderDetails, username, userId }),
      });

      if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);

      const data = await response.json();
      console.log("Ответ сервера:", data);

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} width={300}>
        <Typography variant="h6">Корзина</Typography>
        <Typography variant="body2">
          Количество товаров: {totalItems}
        </Typography>
        <List>
          {filteredCart.length > 0 ? (
            filteredCart.map(([product, count]) => (
              <ListItem
                key={product}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemText primary={`${product}: ${count}`} />
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(product)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton size="small" onClick={() => addToCart(product)}>
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              {/* <ListItemText primary="Корзина пуста" /> */}
            </ListItem>
          )}
        </List>

        <Box display="flex" flexDirection="column" gap={1} mt={2}>
          {totalItems > 0 && (
            <Button
              onClick={handleAddOrder}
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ padding: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Оформить заказ"}
            </Button>
          )}
          {success && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
              color="green"
            >
              <CheckCircleIcon />
              <Typography ml={1}>Заказ оформлен!</Typography>
            </Box>
          )}
          {error && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={1}
              color="red"
            >
              <ErrorIcon />
              <Typography ml={1}>Ошибка заказа</Typography>
            </Box>
          )}
          <Button variant="text" onClick={onClose}>
            Закрыть
          </Button>
          {totalItems > 0 && (
            <Button
              sx={{ mt: 3 }}
              onClick={clearCart}
              variant="contained"
              color="secondary"
            >
              Очистить корзину
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Cart;
