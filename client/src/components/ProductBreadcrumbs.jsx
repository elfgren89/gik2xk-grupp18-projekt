import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom'; 

// "breadcrumbs" för att visa navigeringsmeny för produkter
const ProductBreadcrumbs = ({ category }) => {
  const navigate = useNavigate(); 

  // renderar navigeringsmeny
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize='small' />}
      aria-label='breadcrumb'
    >
      <Link 
        color='inherit' 
        component="button" 
        onClick={() => navigate('/')} 
      > 
        Hem
      </Link>
      <Typography color='textPrimary'>{category}</Typography>
    </Breadcrumbs>
  );
};

export default ProductBreadcrumbs;
