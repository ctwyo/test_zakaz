import React from "react";
import { AppBar, Toolbar, IconButton, Badge, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Navbar = ({ cartCount, toggleMenu }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={toggleMenu}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Мой магазин
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
