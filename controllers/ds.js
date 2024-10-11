const express = require("express");
const DataService = require("../services/dataService");

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await DataService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await DataService.getItemById(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new item
router.post("/", async (req, res) => {
  try {
    const newItem = await DataService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await DataService.updateItem(req.params.id, req.body);
    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await DataService.deleteItem(req.params.id);
    if (deletedItem) {
      res.status(200).json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
