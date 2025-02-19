import React from "react";
import { Paper, Button, Typography, Box } from "@mui/material";

const ProductItem = ({ product, addToCart, removeFromCart, cartCount }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">{product}</Typography>
      <Box mt={2} display="flex" alignItems="center">
        <Button onClick={() => removeFromCart(product)}>-</Button>
        <Typography variant="body1" sx={{ mx: 2 }}>
          {cartCount}
        </Typography>
        <Button onClick={() => addToCart(product)}>+</Button>
      </Box>
    </Paper>
  );
};

export default ProductItem;
