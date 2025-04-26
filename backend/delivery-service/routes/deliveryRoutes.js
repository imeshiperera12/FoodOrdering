import express from "express";
import {
  assignDelivery,
  getDeliveriesByPerson,
  updateDeliveryStatus,
  getDeliveryById,
  trackDeliveryByOrderId
} from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const deliveryRoutes = express.Router();

deliveryRoutes.post("/assign", assignDelivery);
deliveryRoutes.get("/driver/:deliveryPersonId", authMiddleware, authorizeRoles('delivery_person'), getDeliveriesByPerson);
deliveryRoutes.put("/status/:deliveryId", authMiddleware, authorizeRoles('delivery_person'), updateDeliveryStatus);
// deliveryRoutes.put("/location/:deliveryId", updateDeliveryLocation); //In here need to be update location base on driver GPS
deliveryRoutes.get("/:deliveryId",authMiddleware, authorizeRoles('delivery_person', 'admin'), getDeliveryById);
deliveryRoutes.get("/track/:orderId", authMiddleware, authorizeRoles('customer'), trackDeliveryByOrderId);

export default deliveryRoutes;