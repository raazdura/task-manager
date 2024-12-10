import mongoose, { Schema, Document, Types } from 'mongoose';

// Task interface (TypeScript interface)
interface ITask extends Document {
  title: string;
  description?: string;
  deadline: Date;
  status: 'pending' | 'completed';
}

// Task Schema
const TaskSchema: Schema<ITask> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
},
{ timestamps: true });

// Indexing the 'title' field for faster search by title
TaskSchema.index({ title: 'text' }); // Full-text index

// Indexing the 'status' field for faster queries by status
TaskSchema.index({ status: 1 }); // Index on status

// Optionally, compound index for status and deadline
TaskSchema.index({ status: 1, deadline: 1 });

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
