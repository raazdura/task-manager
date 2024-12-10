import express from 'express';
import taskController from '../controllers/tasks';
import multer from 'multer';

const router = express.Router();

const upload = multer();

// Create a task
router.post('/tasks', upload.none(), taskController.createTask);

router.put('/update', upload.none(), taskController.updateTask);

// Update task title
router.put('/tasks/:taskId/title', upload.none(), taskController.updateTitle);

// Update task description
router.put('/tasks/:taskId/description', upload.none(), taskController.updateDescription);

// Update task deadline
router.put('/tasks/:taskId/deadline', upload.none(), taskController.updateDeadline);

// Update task status
router.put('/:taskId/status', upload.none(), taskController.updateStatus);

// Delete a task
router.delete('/:taskId', taskController.deleteTask);

// Fetch task details by ID
// router.get('/tasks/:taskId', taskController.getTaskDetails);

// Fetch list of tasks
router.get('/tasks', taskController.getTasksList);

// Search tasks by title
router.post('/search', upload.none(),  taskController.searchTasksByTitle);

export default router;
