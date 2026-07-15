import express from 'express';
import { 
  getDestinations,
  getDestinationById,
  createDestination, 
  updateDestination, 
  deleteDestination 
} from '../controllers/destinationController.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', createDestination); // In a real app, protect this route
router.put('/:id', updateDestination); // In a real app, protect this route
router.delete('/:id', deleteDestination); // In a real app, protect this route

export default router;
