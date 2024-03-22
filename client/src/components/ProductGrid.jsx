import React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProductGrid = ({ products }) => {
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Grid container spacing={2} sx={{ padding: theme.spacing(2) }}>
      {products.map((product) => (
        <Grid
          item
          key={product.id}
          xs={6} // 2 produkter per rad på extra små skärmar
          sm={4} // 2 produkter per rad på små skärmar
          md={4} // 3 produkter per rad på mellanstora skärmar
          lg={matchesLG ? 3 : 6} // 4 produkter per rad på stora skärmar
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
