import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './views/Home';
import ProductDetail from './components/ProductDetail';
import Layout from './components/Layout';
import { CartProvider } from './contexts/CartContext';
import CategoryPage from './views/CategoryPage';
import ThemeSwitch from './components/ThemeSwitch';
import Footer from './components/Footer';
import './App.css';
import { Box } from '@mui/material';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => setDarkMode(!darkMode); // Uppdatera för att växla mellan teman
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
      <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
            </Routes>
          </Layout>
          </Box>
          <Footer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Box> 
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
