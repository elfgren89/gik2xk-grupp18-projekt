import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Importera Link från react-router-dom
import bannerImage from '../assets/banner-easter-2-1920x300.png';
import paskreaImage from '../assets/paskrea.png';

// komponent för att visa banner med länk till säsongskategorin
const Banner = () => {
  return (
    <Link to="/category/Säsong" style={{ textDecoration: 'none' }}>
      {/* container för banner */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '300px',
          backgroundImage: `url(${bannerImage})`, // bakgrundsbild banner
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          },
        }}
      >
         {/* container för innehåll i banner */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            margin: 1,
            maxWidth: '1200px',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            '& img': {
              height: '80%', // standardstorlek
              objectFit: 'contain',
              '@media (max-width: 705px)': {
                height: '60%', // medium skärmar
              },
              '@media (max-width: 475px)': {
                height: '50%', // små skärmar
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
          }}
        >
          {/* påskrea bild */}
          <img src={paskreaImage} alt='Påskrea' />
        </Box>
      </Box>
    </Link>
  );
};

export default Banner;
