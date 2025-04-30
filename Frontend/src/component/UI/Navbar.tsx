import React, { useState, useRef, useEffect } from "react";
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
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Person2Outlined from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Login, LoginOutlined } from "@mui/icons-material";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { User } from "@/types/User";
import useUserStore from "@/store/useUserStore";

// Type for Menu Anchor Element
type AnchorElType = null | HTMLElement;

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<AnchorElType>(null); // Menu anchor element
  const [searchOpen, setSearchOpen] = useState(false); // State to control search bar visibility
  const [searchValue, setSearchValue] = useState(""); // State to track input value
  const searchRef = useRef<HTMLInputElement>(null); // Ref to track the input field
  const {isAdmin} = useUserStore()
  // Toggle Drawer
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Handle Menu open and close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Search bar toggle
  const handleSearchToggle = () => {
    setSearchOpen(true);
  };

  // Collapse search bar if it loses focus and is empty
  const handleBlur = () => {
    if (searchValue.trim() === "") {
      setSearchOpen(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    useUserStore.getState().checkLogin();
  }, []);
  const { isLoggedIn } = useUserStore();
  const handleLogout = async () => {
    try {
      // Call the logout endpoint on the backend
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/users/logout`, {}, {
        withCredentials: true, // Important for cookies
      });
  
   
      useUserStore.getState().logout(); // This clears the user data from the store and localStorage

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <AppBar position="static" className="shadow-lg" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Center Section - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to={"/"}>
            <img src="/assets/logo.png" alt="Skin Care Pro" style={{ height: "40px" }} />
          </Link>
        </Box>

        {/* Left Section - Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, alignItems: "center" }}>
          <Link to={"/"}>  
            <Typography variant="body1" sx={{ cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4" } }}>
              Home
            </Typography>
          </Link>
          <Link to={"/shop"}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4" } }}>
              Shop
            </Typography>
          </Link>
          <Link to={"/ai-tools-page"}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4" } }}>
              AI Tools
            </Typography>
          </Link>
          <Link to={"/about-us"}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4" } }}>
              About Us
            </Typography>
          </Link>
          <Link to={"/contact-us-page"}>
            <Typography variant="body1" sx={{ cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4" } }}>
              Contact Us
            </Typography>
          </Link>
        </Box>

        {/* Right Section - Icons */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Search Bar Toggle */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                key="searchBar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <InputBase
                  ref={searchRef}
                  placeholder="Search…"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onBlur={handleBlur}
                  autoFocus
                  sx={{
                    borderBottom: "1px solid gray",
                    width: "100%",
                    padding: "0 8px",
                    "&:focus": {
                      borderBottom: "2px solid #FF69B4",
                    },
                    color: "gray",
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {!searchOpen && (
            <IconButton onClick={handleSearchToggle}>
              <SearchIcon sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }} />
            </IconButton>
          )}
          
          <Link to="/cart-page">
            <IconButton>
              <ShoppingCartOutlinedIcon sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }} />
            </IconButton>
          </Link>
          <IconButton onClick={handleMenuOpen}>
            <Person2Outlined sx={{ fontSize: "1.7rem", color: "gray", "&:hover": { color: "#FF69B4" } }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{ onMouseLeave: handleMenuClose }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
      
      { isLoggedIn?
      
      <>
      
           <Link to={"/profile-page"}>
                <MenuItem onClick={handleMenuClose}>
                  <AccountCircleIcon sx={{ marginRight: 2 }} />
                  <Typography fontSize={14} color="gray">
                    My Profile
                  </Typography>
                </MenuItem>
              </Link>
                 <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ marginRight: 2 }} />
                <Typography fontSize={14} color="gray">
                  Settings
                </Typography>
              </MenuItem>
              
                <MenuItem  onClick={() => {
  handleLogout();
  handleMenuClose(); // Close the menu dropdown if needed
}}>
                  <LogoutIcon sx={{ marginRight: 2 }} />
                  <Typography fontSize={14} color="gray">
                    Log Out
                  </Typography>
                </MenuItem>
            </>:
            <> <Link to={"/login"}>
                  <MenuItem >
              <LoginOutlined sx={{ marginRight: 2 }} />
                  <Typography fontSize={14} color="gray">
                    Log In
                  </Typography>
                </MenuItem>
                </Link>
            </>
            
            }
            </motion.div>
          </Menu>
        </Box>

        {/* Hamburger Menu for Mobile */}
        <IconButton sx={{ display: { xs: "block", md: "none" } }} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
          <Link to={"/shop"}>        <ListItem >
           <ListItemText primary="Shop" />
            </ListItem>
            </Link>
            <ListItem>

              <ListItemText primary="About Us" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
