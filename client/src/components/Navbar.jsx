import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  InputBase,
  Badge,
  ListItemIcon,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import ThemeSwitch from './ThemeSwitch';
import AddProductModal from '../components/AddProductModal';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import fiestaFunLogo from '../assets/FiestaFun.png';
import { useCart } from '../contexts/CartContext'; 
import Cart from './Cart';
import { getProductList } from '../services/productService';
import { useProducts } from '../contexts/ProductContext';

// design för sökrutan med Material-UI
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: 'auto',
}));

// design för wrapper av sökrutan
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// design för input
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(5)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '25ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

// komponent Navbar som hanterar navigationsfältet för webbplatsen med interaktioner
const Navbar = ({ setTheme }) => {
  const { fetchProducts } = useProducts(); // hämtar produkter med anpassad hook
  const navigate = useNavigate(); // hämtar funktion från react router för navigering
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false); // state för hantering av kategori-drawer
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false); // state för hantering av varukorgs-drawer
  const { cartItemsCount } = useCart(); // hämtar cartItemsCount från CartContext för att visa antal i varukorgen
  const [products, setProducts] = useState([]); // state för att lista över produkter ska vara initialt tom
  const [openModal, setOpenModal] = useState(false); // state för hantering av modalen
  const [accountTooltipOpen, setAccountTooltipOpen] = useState(false); // state för tooltipen för kontoikon
  
  // effekt för hämtning av produkter när komponenten renderas
  useEffect(() => {
    fetchProducts();
  }, []);

  // funktion för att öppna modalen
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // funktion för att stänga modalen och hämta produkter på nytt
  const handleCloseModal = () => {
    setOpenModal(false);
    fetchProducts();
  };

  // funktion för att lägga till produkt till produktsamlingen
  const handleAddProduct = (newProduct) => {
    setProducts((currentProducts) => [...currentProducts, newProduct]);
  };

  // funktion för att hantera klick på kontoikon och visa tooltipen (meddelande)
  const handleAccountClick = () => {
    setAccountTooltipOpen(true); // Visa Tooltip när ikonen klickas
    // timer för att dölja Tooltip automatiskt efter 2 sekunder
    setTimeout(() => {
      setAccountTooltipOpen(false);
    }, 2000);
  };

  // funktion för att öppna eller stänga drawer baserat på event, typ (category/cart) och argument (open/closed)
  const toggleDrawer = (drawer, open) => (event) => {
    if (!event) {
      if (drawer === 'category') {
        setCategoryDrawerOpen(open);
      } else if (drawer === 'cart') {
        setCartDrawerOpen(open);
      }
      return;
    }
  
    // tillåter endast stängning av drawern med tangent Esc
    if (event.type === 'keydown') {
      if (event.key !== 'Esc') {
        return;
      }
    }
  
    // kontrollerar om klicket sker inom .theme-switch-container för att undvika stängning av drawern
    if (event.target.closest('.theme-switch-container')) {
      return;
    }

    // kontrollerar om klicket sker inom modalen eller formuläret för att undvika stängning av drawern.
    if (event.target.closest('.product-modal') || event.target.closest('.product-form')) {
      return;
    }
  
    // öppnar eller stänger drawer baserat på event, typ (category/cart) och argument (open/closed)
    if (drawer === 'category') {
      setCategoryDrawerOpen(open);
    } else if (drawer === 'cart') {
      setCartDrawerOpen(open);
    }
  };
  
  // lista över menyobjekt för kategorierna
  const menuItems = [
    // menyobjekt
    {
      text: 'Barnkalas',
      icon: '/src/assets/icons/ikon_barnkalas_1.png',
      category: 'barnkalas',
    },
    {
      text: 'Examen',
      icon: '/src/assets/icons/ikon_examen_1.png',
      category: 'examen',
    },
    {
      text: 'Födelsedag',
      icon: '/src/assets/icons/ikon_födelsedag.png',
      category: 'födelsedag',
    },
    {
      text: 'Halloween',
      icon: '/src/assets/icons/ikon_halloween.png',
      category: 'halloween',
    },
    {
      text: 'Möhippa',
      icon: '/src/assets/icons/ikon_möhippa.png',
      category: 'möhippa',
    },
    {
      text: 'Svensexa',
      icon: '/src/assets/icons/ikon_svensexa_2.png',
      category: 'svensexa',
    },
    {
      text: 'Säsong',
      icon: '/src/assets/icons/ikon_säsong_4.png',
      category: 'säsong',
    },
  ];

  // funktion för att rendera listan av kategorier inom drawer
  const categoryList = () => (
    <Box
      sx={{
        width: 250,
        position: 'relative',
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer('category', false)}
      onKeyDown={toggleDrawer('category', false)}
    >
    
    {/* rubrik för kategori-drawer */}
    <Typography
      variant="h6"
      gutterBottom
      component="div"
      sx={{ flexGrow: 1, width: '100%', padding: '20px' }}
    >
      Kategorier
    </Typography>

    {/* lista över kategorier */}
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          onClick={() => navigate(`/category/${item.category}`)}
        >
            <ListItemIcon>
            <img
              src={item.icon}
              alt={item.text}
              style={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
    <Divider />
    
    {/* box container för att hantera temaväxling */}
    <Box
    className='theme-switch-container'
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        display: 'flex',
        justifyContent: 'center',
        pb: '20px',
      }}
    >
        {/* knapp för produkthantering */}
        <Button
        variant="outlined"
        onClick={handleOpenModal}
        sx={{
          backgroundColor: 'white', // vit bakgrund
          borderColor: '#FF8000', // orange border
          borderWidth: '1px', //
          color: '#FF8000', // orange textfärg
          '&:hover': {
            backgroundColor: '#FEBE34', // gul bakgrund vid hover
            borderColor: '#FEBE34', // gul border vid hover
            borderWidth: '1px',
            color: 'white', // vit text vid hover
          },
        }}
      >
        Produkthantering
      </Button>

      {/* modal för att lägga till produkt */}
      <AddProductModal
        open={openModal}
        handleClose={handleCloseModal}
        onAddProduct={handleAddProduct}
      />
    </Box>
  </Box>
);

// returnerar Navbar-komponenten med innehåll och layout för navigeringsfältet
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          backgroundImage: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(to top, #3B434B, #121212 80%)' //dark mode, ljusare färg längst ner (v), mörkare färg högst upp (h)
              : 'linear-gradient(to top, #FEBE34, #FF8000 80%)', //light mode, ljusare färg längst ner (v), mörkare färg högst upp (h)
          flexGrow: 1,
        }}
        position='static'
      >
        {/* verktygsfält (navigationsikoner och sökruta) */}
        <Toolbar
          sx={{
            maxWidth: '1200px',
            width: '100%',
            margin: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* menyknapp (öppnar kategori-drawer) */}
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={toggleDrawer('category', true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon /> {/* ikonen för meny */}
          </IconButton>

          {/* fiesta-fun logotyp (navigerar till startsida) */}
          <IconButton
            color='inherit'
            aria-label='home'
            onClick={() => navigate('/')}
          >
            <img src={fiestaFunLogo} alt='Fiesta Fun' height='70' />
          </IconButton>

          {/* sökfält (endast visuellt/utan funktion) */}
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1 }}
          ></Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon /> {/* sökikon */}
            </SearchIconWrapper>

            {/* inmatningsfält */}
            <StyledInputBase
              placeholder='Sök efter fiestliga produkter..' // förhands-text i sökruta
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* behållare för användarikon och tooltip meddelande */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              title={
                <Typography sx={{ textAlign: 'center', fontSize: '1rem' }}>
                  Inloggning till ditt konto är inte tillgängligt just nu
                </Typography>
              }
              open={accountTooltipOpen} // öppnar tooltip
              disableFocusListener // inaktiverarar fokus
              disableHoverListener // inaktiverar hover
              disableTouchListener // inaktiverar tryck
              arrow // pil för tooltip
            >
              {/* Knapp för användarkonto */}
              <IconButton
                size='large'
                edge='end'
                color='inherit'
                aria-label='account'
                onClick={handleAccountClick}
              >
                <AccountCircleIcon /> {/* användarikon */}
              </IconButton>
            </Tooltip>

            {/* knapp för varukorgen */}
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              aria-label='cart'
              onClick={toggleDrawer('cart', true)}
            >
               {/* varukorgsikon */}
              <Badge badgeContent={cartItemsCount} color='error'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

          </Box>
        </Toolbar>
      </AppBar>

      {/* kategori-drawer */}
      <Drawer
        anchor='left'
        open={categoryDrawerOpen}
        onClose={toggleDrawer('category', false)}
      >
        {/* kategori lista */}
        {categoryList()}
      </Drawer>
      <Drawer
        anchor='right'
        open={cartDrawerOpen}
        onClose={toggleDrawer('cart', false)}
      >
        {/* varukorgsdrawer */}
        <Cart toggleDrawer={toggleDrawer('cart', false)} />
      </Drawer>
    </Box>
  );
};

export default Navbar;