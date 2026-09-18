import mongoose from 'mongoose';
import JobApplication, { APPLICATION_STATUSES } from '../models/JobApplication.js';
import asyncHandler from '../middleware/asyncHandler.js';

const buildApplicationQuery = (req) => {
  const { search, status, jobType } = req.query;
  const query = { user: req.user._id };

  if (status && status !== 'All') {
    query.status = status;
  }

  if (jobType && jobType !== 'All') {
    query.jobType = jobType;
  }

  if (search) {
    const expression = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ company: expression }, { position: expression }, { location: expression }, { notes: expression }];
  }

  return query;
};

const getSortOption = (sort = '-appliedDate') => {
  const allowedSorts = {
    newest: { appliedDate: -1 },
    oldest: { appliedDate: 1 },
    company: { company: 1 },
    status: { status: 1 },
    '-appliedDate': { appliedDate: -1 }
  };

  return allowedSorts[sort] || allowedSorts.newest;
};

export const getApplications = asyncHandler(async (req, res) => {
  const query = buildApplicationQuery(req);
  const applications = await JobApplication.find(query).sort(getSortOption(req.query.sort));

  res.json({ applications });
});

export const getApplicationById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Application not found');
  }

  const application = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.json({ application });
});

export const createApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({ application });
});

export const updateApplication = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Application not found');
  }

  const application = await JobApplication.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.json({ application });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Application not found');
  }

  const application = await JobApplication.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.json({ message: 'Application deleted' });
});

export const getApplicationStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const [statusCounts, recentApplications, total] = await Promise.all([
    JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    JobApplication.find({ user: req.user._id }).sort({ appliedDate: -1, createdAt: -1 }).limit(5),
    JobApplication.countDocuments({ user: req.user._id })
  ]);

  const byStatus = APPLICATION_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  statusCounts.forEach((item) => {
    byStatus[item._id] = item.count;
  });

  res.json({
    stats: {
      total,
      byStatus
    },
    recentApplications
  });
});

