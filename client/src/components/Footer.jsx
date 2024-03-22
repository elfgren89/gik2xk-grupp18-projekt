import React from 'react';
import { Box, Typography, Container, Switch } from '@mui/material';
import footerImage from '../assets/footer.png';

// komponenten Footer tar emot props för toggleDarkMode och
// renderar en footer med bakgrundsbild med container för innehållet

const Footer = ({ darkMode, toggleDarkMode }) => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '678px',
        backgroundImage: `url(${footerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column', // vertikal organisering
        justifyContent: 'flex-end', // justerar innehåll mot nedre kant
      }}
    >
      <Container maxWidth="lg" sx={{
        position: 'absolute',
        bottom: 0, // placerar containern längst ned i footern
        left: 0,
        right: 0,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'transparent', 
        paddingY: '20px',
      }}>

         {/* visar "copyright" och år */}
        <Typography variant="body2" color="white" align="center">
          © {new Date().getFullYear()} FiestaFun
        </Typography>

        {/* toggle switch för dark mode */}
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Container>
    </Box>
  );
};

export default Footer;
