import React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const ProductRating = ({
  ratingValue,
  size = 'medium', // standardstorlek på stjärnor
  readOnly = true, // om betyget inte kan ändras
  onRatingChange, // funktion för att hantera ändringar i betyget
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        name='product-rating'
        value={Number(ratingValue)} // ser till att värdet är ett nummer
        readOnly={readOnly}
        onChange={(event, newValue) => {
          if (onRatingChange) onRatingChange(newValue);
        }}
        precision={1} // lägger till detta för att tillåta halva stjärnor
        size={size}
      />
    </Box>
  );
};

export default ProductRating;