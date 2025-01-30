import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const App = () => {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [cart, setCart] = useState([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/products');
    setProducts(response.data);
    setCart([])
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setIsLoggedIn(true);
      setRole(response.data.role);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleAddToCart = async (productId) => {
    const quantity = prompt('Enter quantity:', 1);
    if (quantity) {
      await axios.post('http://localhost:5000/cart', { userId: 'some-user-id', productId, quantity: parseInt(quantity) });
      alert('Added to cart!');
    }
  };

  const handleCreateProduct = async () => {
    await axios.post('http://localhost:5000/products', newProduct);
    fetchProducts();
    setProductDialogOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    await axios.delete(`http://localhost:5000/products/${productId}`);
    fetchProducts();
  };

  const handleEditProduct = async () => {
    const { name, price, stock } = selectedProduct;
    await axios.put(`http://localhost:5000/products/${selectedProduct._id}`, { name, price, stock });
    fetchProducts();
    setProductDialogOpen(false);
  };

  const handlePurchase = async () => {
    const response = await axios.post('http://localhost:5000/cart/purchase', { userId: 'some-user-id' });
    alert(response.data);
  };

  return (
    <Container>
      {!isLoggedIn ? (
        <div>
          <Typography variant="h4">Login</Typography>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleLogin}>Login</Button>
        </div>
      ) : (
        <div>
          <Typography variant="h4">Hey Welcome, {role === 'admin' ? 'Admin' : 'User'}</Typography>

          {/* Admin Controls */}
          {role === 'admin' && (
            <Box sx={{ marginBottom: 2 }}>
              <Button variant="contained" onClick={() => setProductDialogOpen(true)}>Add New Product</Button>
            </Box>
          )}

          <List > 
            {products.map((product) => (
              <ListItem key={product._id} sx={{width:'100%'}}>
                <Card sx={{display:'flex' ,justifyContent:'space-between',width:'100%',height:'100%', padding:"10px",alignItems:'center'}}>
                  <CardContent sx={{display:'flex',alignItems:'center' ,justifyContent:'space-evenly',width:'60%'}}>
                    <Typography >{product.name}</Typography>
                    <Typography>${product.price}</Typography>
                    <Typography>Stock: {product.stock}</Typography>
                    </CardContent>
                  <CardActions>
                    {role === 'user' && (
                      <Button variant="contained" onClick={() => handleAddToCart(product._id)}>
                        Add to Cart
                      </Button>
                    )}
                    {role === 'admin' && (
                      <>
                        <IconButton onClick={() => { setSelectedProduct(product); setProductDialogOpen(true); }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteProduct(product._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </ListItem>
            ))}
          </List>

          {/* User Cart Purchase */}
          {role === 'user' && cart.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" onClick={handlePurchase}>Purchase</Button>
            </Box>
          )}
        </div>
      )}

      {/* Product Dialog (Create/Edit Product) */}
      <Dialog open={productDialogOpen} onClose={() => setProductDialogOpen(false)}>
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth value={selectedProduct ? selectedProduct.name : newProduct.name} onChange={(e) => selectedProduct ? setSelectedProduct({ ...selectedProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} />
          <TextField label="Price" type="number" fullWidth value={selectedProduct ? selectedProduct.price : newProduct.price} onChange={(e) => selectedProduct ? setSelectedProduct({ ...selectedProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value })} />
          <TextField label="Stock" type="number" fullWidth value={selectedProduct ? selectedProduct.stock : newProduct.stock} onChange={(e) => selectedProduct ? setSelectedProduct({ ...selectedProduct, stock: e.target.value }) : setNewProduct({ ...newProduct, stock: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
          <Button onClick={selectedProduct ? handleEditProduct : handleCreateProduct}>{selectedProduct ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
