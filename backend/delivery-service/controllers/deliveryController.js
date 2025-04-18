import Delivery from '../models/Delivery.js';

// Assign a delivery to a delivery person
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId, userId, deliveryAddress, deliveryFee } = req.body;

    const delivery = await Delivery.create({
      orderId,
      deliveryPersonId,
      userId,
      deliveryAddress,
      deliveryFee
    });

    res.status(201).json({ message: 'Delivery assigned', delivery });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning delivery', error: err.message });
  }
};

// Get deliveries for a delivery person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;
    const deliveries = await Delivery.find({ deliveryPersonId });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const updated = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: 'Delivery status updated', delivery: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Update GPS location of delivery person
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { lat, lng } = req.body;

    const updated = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        locationUpdate: { lat, lng, updatedAt: Date.now() }
      },
      { new: true }
    );

    res.status(200).json({ message: 'Location updated', delivery: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err.message });
  }
};