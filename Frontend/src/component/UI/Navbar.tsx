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
  Badge,
  Modal,
  Fade,
  Backdrop,
  Avatar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import useCartStore from "@/store/useCartStore";
import useDebounce from "@/hooks/useDebounce";
import { Product } from "@/types/Product";
import NotificationBell from "./NotificationBell";

// Type for Menu Anchor Element
type AnchorElType = null | HTMLElement;

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<AnchorElType>(null); // Menu anchor element
  const [searchOpen, setSearchOpen] = useState(false); // State to control search bar visibility
  const [searchValue, setSearchValue] = useState(""); // State to track input value
  const searchRef = useRef<HTMLInputElement>(null); // Ref to track the input field
  const {user} = useUserStore()
  const [searchModalOpen, setSearchModalOpen] = useState(false);
const [searchResults, setSearchResults] = useState([]);
const debouncedSearch = useDebounce(searchValue, 500);
  // Toggle Drawer
  const totalItems = useCartStore((state) => state.getTotalItems());
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
  setSearchModalOpen(true);
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

  useEffect(() => {
  if (debouncedSearch.trim()) {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND_URL}/products/search?q=${debouncedSearch}`)
      .then((res:any) => setSearchResults(res.data))
      .catch((err) => console.error(err));
  } else {
    setSearchResults([]);
  }
}, [debouncedSearch]);

  return (
    <AppBar  className="shadow-lg  " color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0", position: {
      xs: "sticky", // sticky on small screens
      md: "static", // static on medium and up
    }}}>
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
        <Badge
          badgeContent={totalItems}
          color="secondary"
          overlap="circular"
          showZero={false}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              fontWeight: "bold",
              backgroundColor: "#FF69B4",
              color: "white",
              top: 0,
              right: 0,
            },
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{ color: "gray", "&:hover": { color: "#FF69B4" } }}
          />
        </Badge>
      </IconButton>
    </Link>

    {isLoggedIn && <NotificationBell/>} 
       <IconButton onClick={handleMenuOpen}>
  {isLoggedIn && user?.profileImage ? (
    <Avatar
      src={user.profileImage}
      alt="Profile"
      sx={{ width: 36, height: 36 }}
    />
  ) : (
    <Person2Outlined
      sx={{
        fontSize: "1.7rem",
        color: "gray",
        "&:hover": { color: "#FF69B4" },
      }}
    />
  )}
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
              <Link to={"/profile-page/account-settings"}>    <MenuItem onClick={handleMenuClose}>
 
              <SettingsIcon sx={{ marginRight: 2 }} />
                <Typography fontSize={14} color="gray">
                  Settings
                </Typography>
          
              </MenuItem>
              </Link>  
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
<Modal
  open={searchModalOpen}
  onClose={() => setSearchModalOpen(false)}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{ timeout: 500 }}
>
  <Fade in={searchModalOpen}>
    <Box
      sx={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "90%",
        maxWidth: 600,
        maxHeight: "80vh",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <SearchIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Search Products
        </Typography>
      </Box>

      {/* Search Input */}
      <InputBase
        fullWidth
        placeholder="Type product name, brand, or category..."
        value={searchValue}
        onChange={handleSearchChange}
        autoFocus
        sx={{
          mb: 2,
          borderBottom: "1px solid #ccc",
          px: 1,
          py: 0.5,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      />

      {/* Scrollable Result Area */}
      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          pr: 1,
        }}
      >
        {searchResults.length > 0 ? (
          searchResults.map((product: Product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => setSearchModalOpen(false)} // ✅ close modal on click
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 2,
                  borderBottom: "1px solid #eee",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                  },
                }}
              >

               
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    variant="rounded"
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.brand} &bull; ${product.price}
                    </Typography>
                  </Box>
                </Box>
                <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#aaa" }} />
              </Box>
            </Link>
          ))
        ) : (
          <Typography variant="body2" color="gray" sx={{ px: 2, py: 1 }}>
            {debouncedSearch ? "Searching..." : "Start typing to search"}
          </Typography>
        )}
      </Box>
    </Box>
  </Fade>
</Modal>

      {/* Drawer for Mobile Menu */}
  <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
  <Box
    sx={{ width: 250 }}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <List>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <ListItem >
          <HomeIcon sx={{ mr: 2 , cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4"}}} />
          <ListItemText primary="Home" />
        </ListItem>
      </Link>

      <Link to="/shop" style={{ textDecoration: "none", color: "inherit" }}>
        <ListItem >
          <StorefrontIcon sx={{ mr: 2 , cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4"}}} />
          <ListItemText primary="Shop" />
        </ListItem>
      </Link>

      <Link to="/ai-tools-page" style={{ textDecoration: "none", color: "inherit" }}>
        <ListItem >
          <SmartToyIcon sx={{ mr: 2 , cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4"}}} />
          <ListItemText primary="AI Tools" />
        </ListItem>
      </Link>

      <Link to="/about-us" style={{ textDecoration: "none", color: "inherit" }}>
        <ListItem >
          <InfoIcon sx={{ mr: 2 , cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4"}}} />
          <ListItemText primary="About Us" />
        </ListItem>
      </Link>

      <Link to="/contact-us-page" style={{ textDecoration: "none", color: "inherit" }}>
        <ListItem >
          <ContactMailIcon sx={{ mr: 2 , cursor: "pointer", color: "gray", "&:hover": { color: "#FF69B4"}}} />
          <ListItemText primary="Contact Us" />
        </ListItem>
      </Link>
    </List>
  </Box>
</Drawer>

    </AppBar>
  );
};

export default Navbar;
