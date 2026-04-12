import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResult extends Document {
  userId: string;
  answers: {
    q1: string[];
    q2: string;
    q3: string[];
    q4: string;
    q5: string;
    q6: string;
  };
  recommendedBundle: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: String, required: true, unique: true },
    answers: {
      q1: { type: [String], required: true },
      q2: { type: String, required: true },
      q3: { type: [String], required: true },
      q4: { type: String, required: true },
      q5: { type: String, required: true },
      q6: { type: String, required: true },
    },
    recommendedBundle: { type: String, required: true },
  },
  { timestamps: true }
);

QuizResultSchema.index({ userId: 1 }, { unique: true });

const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult ||
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
