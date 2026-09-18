import mongoose from 'mongoose';

export const APPLICATION_STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [120, 'Company must be less than 120 characters']
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [120, 'Position must be less than 120 characters']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [120, 'Location must be less than 120 characters']
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Applied',
      index: true
    },
    appliedDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    salary: {
      type: String,
      trim: true,
      maxlength: [80, 'Salary must be less than 80 characters']
    },
    jobUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Job URL must be less than 500 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes must be less than 2000 characters']
    }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ user: 1, company: 1, position: 1 });
jobApplicationSchema.index({ company: 'text', position: 'text', location: 'text', notes: 'text' });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

