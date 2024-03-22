import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  createProduct,
  getProductList,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import { getCategories } from '../services/categoryService';

// formulär för att lägga till och redigera produkter i produkthanterare
const AddProductForm = ({ handleClose, onAddProduct }) => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
  });
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageType, setImageType] = useState('url');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');

  // funktion för att hämta kategorier (fetch/get/set)
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    // funktion för att hämta produkter (fetch/get/set)
    const fetchProducts = async () => {
      const productList = await getProductList();
      setProducts(productList);
    };

    // anropar funktionerna för att hämta kategorier och produkter
    fetchCategories();
    fetchProducts();
  }, []);

  // hanterar ändringar i formulärinmatning
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // hanterar ändringar i val av produkt
  const handleProductChange = async (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);

    // hämtar produktinformation för vald produkt
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      setProduct({
        title: productToEdit.title,
        description: productToEdit.description,
        price: productToEdit.price,
        categoryId: productToEdit.categoryId,
        image: productToEdit.image || '',
      });
      setImageType(productToEdit.image ? 'url' : 'upload');
    }
  };

  // hanterar ändringar av bildval
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (imageType === 'upload' && file) {
      setSelectedFile(file);
      setSelectedFileName(file.name); // sparar filnamnet när en fil väljs
    } else {
      handleChange(e);
    }
  };

  // hanterar borttagning av vald fil
  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setSelectedFileName(''); // tar bort filnamnet
  };

  // hanterar formulärinskick
  const handleSubmit = async (e) => {
    e.preventDefault();

    // förbereder formulärdata för inskick
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    if (selectedFile && imageType === 'upload') {
      formData.append('image', selectedFile);
    }

    // skapar ny produkt
    try {
      const newProduct = await createProduct(formData);
      onAddProduct(newProduct);
      alert('Produkten har lagts till framgångsrikt');
      handleClose();
    } catch (error) {
      console.error('Fel vid tillägg av produkt:', error.response || error);
      alert('Misslyckades med att lägga till produkt');
    }
  };

  // hanterar uppdateringar av produkt
  const handleUpdateProduct = async () => {
    // loggar det valda produkt-ID:t
    console.log('Uppdaterar produkt med ID:', selectedProductId);

    // förbereder formulärdata för uppdatering
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (product[key] != null && product[key] !== '') {
        // kontrollerar tomma strängar
        formData.append(key, product[key]);
      }
    });

    // hanterar bilduppladdning
    if (imageType === 'upload' && selectedFile) {
      formData.append('image', selectedFile);
    }

    // felsökning: loggar formData innehåll
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // uppdaterar produkten med det valda ID:t och formData
    try {
      const updatedProduct = await updateProduct(selectedProductId, formData);
      alert('Produkten har uppdaterats framgångsrikt');
      handleClose();
    } catch (error) {
      console.error('Fel vid uppdatering av produkt:', error);
      alert('Misslyckades med att uppdatera produkten');
    }
  };

  // hanterar borttagning av produkt
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProductId);
      alert('Produkten har tagits bort framgångsrikt');
      handleClose();
    } catch (error) {
      console.error('Fel vid borttagning av produkt:', error);
      alert('Misslyckades med att ta bort produkten');
    }
  };

  // öppnar en dialog-komponent för att hantera produkter
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      {/* öppnar en DialogTitle-komponent */}
      <DialogTitle id='form-dialog-title'>
        Hantera produkter
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* öppnar en DialogContent-komponent */}
      <DialogContent>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <FormControl fullWidth margin='dense' variant='outlined'>
            <InputLabel id='product-select-label' shrink>
              Välj Produkt
            </InputLabel>
            <Select
              labelId='product-select-label'
              id='product-select'
              value={selectedProductId}
              onChange={handleProductChange}
              displayEmpty
              label='Välj Produkt'
            >
              {/* visar alternativ för att lägga till ny produkt */}
              <MenuItem value=''>
                <em>Lägg till ny produkt</em>
              </MenuItem>

              {/* Mappar igenom produkterna för att visa dem som alternativ */}
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* textfält för att ange produkttiteln */}
          <TextField
            autoFocus
            margin='dense'
            label='Produkttitel'
            type='text'
            fullWidth
            variant='outlined'
            name='title'
            value={product.title}
            onChange={handleChange}
          />

          {/* textfält för att ange produktbeskrivningen */}
          <TextField
            margin='dense'
            label='Produktbeskrivning'
            type='text'
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            name='description'
            value={product.description}
            onChange={handleChange}
          />

          {/* textfält för att ange produktpriset */}
          <TextField
            margin='dense'
            label='Produktpris'
            type='number'
            fullWidth
            variant='outlined'
            name='price'
            value={product.price}
            onChange={handleChange}
          />

          {/* FormControl för att välja produktkategorin */}
          <FormControl fullWidth margin='dense'>
            <InputLabel id='category-label'>Kategori</InputLabel>
            <Select
              labelId='category-label'
              id='category-select'
              value={product.categoryId}
              onChange={handleChange}
              name='categoryId'
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* FormControl för att välja bildtyp: URL eller uppladdning */}
          <FormControl component='fieldset' margin='dense'>
            <RadioGroup
              row
              name='imageType'
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
            >
              <FormControlLabel
                value='url'
                control={<Radio />}
                label='Använd bild-URL'
              />
              <FormControlLabel
                value='upload'
                control={<Radio />}
                label='Ladda upp bild'
              />
            </RadioGroup>
          </FormControl>

          {/* om bildtypen är uppladdning, visa knapp för att välja fil och vald fil */}
          {imageType === 'upload' ? (
            <Box margin='dense'>
              <Button variant='contained' component='label'>
                Välj fil
                <input
                  type='file'
                  hidden
                  onChange={handleImageChange}
                  name='image'
                />
              </Button>
              {selectedFileName && (
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='subtitle1' noWrap>
                    {selectedFileName}
                  </Typography>
                  <IconButton onClick={handleRemoveSelectedFile}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ) : (
            // annars, visa textfält för att ange bild-URL
            <TextField
              margin='dense'
              label='Bild-URL'
              type='text'
              fullWidth
              variant='outlined'
              name='image'
              value={product.image}
              onChange={handleChange}
              placeholder='https://example.com/image.jpg'
            />
          )}

          {/* knapp för att lägga till produkt */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              disabled={selectedProductId !== ''}
            >
              Lägg till produkt
            </Button>

            {/* knapp för att uppdatera produkt */}
            <Button
              type='button'
              color='secondary'
              variant='contained'
              onClick={handleUpdateProduct}
              disabled={!selectedProductId}
            >
              Uppdatera produkt
            </Button>
            
            {/* knapp för att ta bort produkt */}
            <Button
              type='button'
              color='error'
              variant='contained'
              onClick={handleDeleteProduct}
              disabled={!selectedProductId}
            >
              Ta bort produkt
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
