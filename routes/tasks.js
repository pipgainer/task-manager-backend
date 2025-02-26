const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Task = require("../models/Task");

// ✅ Create a Task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ user: req.userId, title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Task Creation Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get All Tasks for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error("Fetching Tasks Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get a Single Task by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        console.error("Fetching Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update a Task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = title || task.title;
        task.description = description || task.description;
        await task.save();

        res.json(task);
    } catch (error) {
        console.error("Updating Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Delete a Task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Deleting Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
