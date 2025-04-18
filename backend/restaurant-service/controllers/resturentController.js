import Restaurant from "../models/Restaurant.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, contactNumber, ownerId } = req.body;
    const newRestaurant = await Restaurant.create({
      name,
      address,
      contactNumber,
      ownerId,
    });
    res
      .status(201)
      .json({ message: "Restaurant created", restaurant: newRestaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating restaurant", error: err.message });
  }
};

// Add a menu item
export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItem = req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { menu: menuItem } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Menu item added", restaurant: updatedRestaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding menu item", error: err.message });
  }
};

//update menu items
export const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const updateData = req.body;

    // dynamic update fields
    const updateFields = {};
    for (const key in updateData) {
      updateFields[`menu.$.${key}`] = updateData[key];
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: restaurantId, "menu._id": itemId },
      { $set: updateFields },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item updated", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Error updating menu item", error: err.message });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $pull: { menu: { _id: itemId } } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Menu item deleted", restaurant: updatedRestaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: err.message });
  }
};

// Set restaurant availability
export const setRestaurantAvailability = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { isAvailable } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isAvailable },
      { new: true }
    );
    res.status(200).json({ message: "Availability updated", restaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating availability", error: err.message });
  }
};

// Verify restaurant (admin only)
export const verifyRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json({ message: "Restaurant verified", restaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying restaurant", error: err.message });
  }
};
