'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '../firebase'; 
import { generateDescription } from './huggingface'; 
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(query(collection(firestore, 'inventory')));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    if (item.trim() === '') {
      alert('Item name cannot be empty.');
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const quantity = docSnap.data().quantity || 0;
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1, description });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const quantity = docSnap.data().quantity || 0;
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGenerateDescription = async () => {
    const generatedDescription = await generateDescription(itemName);
    setDescription(generatedDescription);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2} bgcolor="#f5f5f5" p={4}>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField label="Item Name" variant="outlined" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleGenerateDescription}>
              Generate Description
            </Button>
          </Stack>
          {description && (
            <Typography variant="body1" mt={2}>
              Description: {description}
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={() => { addItem(itemName); setItemName(''); setDescription(''); handleClose(); }}>
            Add
          </Button>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
        Add New Item
      </Button>
      <Box borderRadius="8px" boxShadow={3} bgcolor="white" width="80vw" height="80vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} p={4}>
        <Typography variant="h3" color="primary" textAlign="center" gutterBottom>
          Inventory Items
        </Typography>
        <Stack width="100%" spacing={2} overflow="auto" p={2}>
          {inventory.length > 0 ? (
            inventory.map(({ name, quantity, description }) => (
              <Card key={name} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h5">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {quantity}
                  </Typography>
                  {description && (
                    <Typography variant="body2" color="textSecondary">
                      Description: {description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton color="primary" onClick={() => addItem(name)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => removeItem(name)}>
                    <RemoveIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">
              No items in the inventory.
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
