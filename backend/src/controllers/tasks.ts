import { Request, Response } from "express";
import Task from "../models/task";
import User from "../models/user"
import { Types } from 'mongoose';

// Create a task
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Destructure fields from the request body
    const {
      userId,
      title,
      description,
      deadline,
      status,
    }: {
      userId: string;
      title: string;
      description: string;
      deadline: Date;
      status: 'pending' | 'completed';
    } = req.body;

    // Create a new task
    const task = new Task({
      title,
      description,
      deadline,
      status: 'pending',
      user: userId,
    });

    // Save the task
    await task.save();

    // Update the User model to add the task to the user's tasks
    await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: task._id } },
      { new: true } // Return the updated user document
    );

    // Send response with success message
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error: any) {
    // Log error and send response with error message
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task title
export const updateTitle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { title }: { title: string } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.title = title || task.title;

    await task.save();
    res.status(200).json({
      success: true,
      message: "Task title updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task description
export const updateDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { description }: { description: string } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.description = description || task.description;

    await task.save();
    res.status(200).json({
      success: true,
      message: "Task description updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task deadline
export const updateDeadline = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { deadline }: { deadline: Date } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.deadline = deadline || task.deadline;

    await task.save();
    res.status(200).json({
      success: true,
      message: "Task deadline updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task status
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  console.log(taskId);

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    if( task.status == "completed") {
      task.status = "pending";
    }
    else{
      task.status = "completed";
    }

    await task.save();
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update the whole task (title, description, deadline, status)
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    taskId,
    title,
    description,
    deadline,
    status,
  }: {
    taskId: string,
    title?: string;
    description?: string;
    deadline?: Date;
    status?: "pending" | "completed";
  } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Update the task fields with the new data provided in the request body
    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    task.status = status || task.status;

    // Save the updated task
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a task
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    // Find and delete the task
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Remove the task ID from the user's tasks array
    await User.updateMany(
      { tasks: taskId }, // Find all users with this task ID in their tasks array
      { $pull: { tasks: taskId } } // Remove the task ID from the array
    );

    // Send the deleted task back in the response
    res.status(200).json({
      success: true,
      message: "Task deleted successfully and removed from user collection",
      task, // Include the deleted task in the response
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Fetch task details
// export const getUserTasks = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Extract userId from query and pagination parameters (offset, limit) from params
//     const { userId } = req.query; // userId is from query
//     const { offset, limit } = req.params; // offset and limit from params


//     const offsetNumber = parseInt(offset, 10) || 0; // Default to 0 if invalid offset
//     const limitNumber = parseInt(limit, 10) || 10; // Default to 10 if invalid limit

//     // Validate if userId exists in the database
//     const user = await User.findById(userId).exec();

//     // Get the task IDs from the user's `tasks` field
//     const taskIds: Types.ObjectId[] = user.tasks;

//     // Fetch tasks using the task IDs with pagination
//     const tasks = await Task.find({ _id: { $in: taskIds } })
//       .skip(offsetNumber) // Skip the tasks based on offset
//       .limit(limitNumber) // Limit the number of tasks returned
//       .exec();

//     // Send the response with tasks
//     res.status(200).json({
//       success: true,
//       message: 'Tasks fetched successfully',
//       tasks,
//     });
//   } catch (error: any) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Fetch tasks list
export const getTasksList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.query.userId; // Extract user ID from request parameters
    console.log(user);
    // Extract limit and offset from query parameters
    const limit: number = parseInt(req.query.limit as string) || 10; // Default to 10 tasks per page
    const offset: number = parseInt(req.query.offset as string) || 0; // Default to 0 offset

    // Fetch tasks of the user with pagination
    const tasks = await Task.find({ user }) // Filter tasks by userId
      .skip(offset) // Skip the number of tasks specified by offset
      .limit(limit); // Limit the number of tasks to the specified limit

      console.log(tasks)

    // Get total count of tasks for the user for pagination information
    const totalCount = await Task.countDocuments({ user });

    res.status(200).json({
      success: true,
      tasks,
      totalCount,
      totalPages: Math.ceil(totalCount / limit), // Calculate total pages
      currentPage: Math.floor(offset / limit) + 1, // Calculate current page
      limit,
      offset,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const searchTasksByTitle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, userId } = req.body; // Extract search query and userId from the request
  console.log(title, userId); // To help debug the query

  try {
    if (!title || !userId) {
      res.status(400).json({
        success: false,
        message: "Both title and userId are required for search.",
      });
      return;
    }

    // Fetch user by userId and populate the tasks field with task details
    const user = await User.findById(userId).populate('tasks');

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Filter tasks by title using regular expression for case-insensitive search
    const filteredTasks = user.tasks.filter((task) =>
      (task as any).title.match(new RegExp(title, 'i')) // Type assertion to any to avoid the type issue
    );

    res.status(200).json({
      success: true,
      tasks: filteredTasks,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createTask,
  updateTitle,
  updateDescription,
  updateDeadline,
  updateStatus,
  updateTask,
  deleteTask,
  // getTaskDetails,
  getTasksList,
  searchTasksByTitle,
};
