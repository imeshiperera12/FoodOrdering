import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"
import { addMenuItem, createRestaurant, deleteMenuItem, setRestaurantAvailability, updateMenuItem, verifyRestaurant } from "../controllers/resturentController.js";

const restaurantRoutes = express.Router();

restaurantRoutes.post('/', createRestaurant);

//Menu Management
restaurantRoutes.post('/:restaurantId/menu', addMenuItem);
restaurantRoutes.put('/:restaurantId/menu/:itemId', updateMenuItem);
restaurantRoutes.delete('/:restaurantId/menu/:itemId', deleteMenuItem);

restaurantRoutes.patch('/:restaurantId/availability', setRestaurantAvailability);
restaurantRoutes.patch('/:restaurantId/verify', verifyRestaurant);

export default restaurantRoutes;
