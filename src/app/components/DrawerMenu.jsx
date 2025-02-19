import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";

const DrawerMenu = ({ open, toggleDrawer }) => {
  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
      <List>
        <ListItem sx={{ fontSize: "1.5rem" }} button onClick={toggleDrawer}>
          <ListItemText primary="Главная" />
        </ListItem>
        <ListItem button onClick={toggleDrawer}>
          <ListItemText primary="Категории" />
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleDrawer}>
          <ListItemText primary="Настройки" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
