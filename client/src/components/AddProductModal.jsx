import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddProductForm from './AddProductForm';

// komponent som visar modal för att lägga till en ny produkt
const AddProductModal = ({ open, handleClose, onAddProduct }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Lägg till en ny produkt</DialogTitle>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <AddProductForm handleClose={handleClose} onAddProduct={onAddProduct} />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
