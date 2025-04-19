const express = require("express");
const {
  createPayment,
  getPaymentById,
  getUserPayments,
  confirmPayment,
  handlePaymentFailure,
} = require("../controllers/paymentController");

module.exports = function (io) {
  const router = express.Router();

  // Pass io to controller functions using closure
  router.post("/create", (req, res) => createPayment(req, res, io));
  router.get("/:id", getPaymentById);
  router.get("/history/:userId", getUserPayments);
  router.put("/confirm/:paymentId", (req, res) => confirmPayment(req, res, io));
  router.put("/failure/:paymentId", (req, res) =>
    handlePaymentFailure(req, res, io)
  );

  return router;
};
