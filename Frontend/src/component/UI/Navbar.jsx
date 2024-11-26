import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Section - Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              color: "gray",
              "&:hover": { color: "#FF69B4" },
            }}
          >
            Shop
          </Typography>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              color: "gray",
              "&:hover": { color: "#FF69B4" },
            }}
          >
            About Us
          </Typography>
        </Box>

        {/* Center Section - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
    <Link to={"/"}>      <img
            src="/assets/logo.png"
            alt="Skin Care Pro"
            style={{ height: "40px" }}
          />
  </Link>
         
        </Box>

        {/* Right Section - Icons */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <IconButton>
            <SearchIcon sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }} />
          </IconButton>
         <Link to="/login"><IconButton>
            <FavoriteBorderIcon
           sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }}
            />
          </IconButton>
          </Link> 
          <IconButton>
            <ShoppingCartOutlinedIcon
             sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }}
            />
          </IconButton>
        </Box>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem button>
              <ListItemText primary="Shop" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="About Us" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
