const express = require('express');
const UserController = require('../controllers/userController'); // Antag att du har en UserController

const router = express.Router();

// skapar en ny användare
router.post('/', UserController.createUser);

// hämtar en specifik användares information
router.get('/:id', UserController.getUserById);

// uppdaterar en användares information
router.put('/:id', UserController.updateUserById);

// tar bort en användare
router.delete('/:id', UserController.deleteUserById);

// hämtar en användares senaste varukorg
router.get('/:id/getCart', UserController.getUserCart);

module.exports = router;
