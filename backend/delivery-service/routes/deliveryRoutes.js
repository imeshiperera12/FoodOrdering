import express from "express";
import {
  assignDelivery,
  getDeliveriesByPerson,
  updateDeliveryLocation,
  updateDeliveryStatus,
} from "../controllers/deliveryController.js";

const deliveryRoutes = express.Router();

deliveryRoutes.post("/assign", assignDelivery);
deliveryRoutes.get("/driver/:deliveryPersonId", getDeliveriesByPerson);
deliveryRoutes.put("/status/:deliveryId", updateDeliveryStatus);
deliveryRoutes.put("/location/:deliveryId", updateDeliveryLocation);

export default deliveryRoutes;
