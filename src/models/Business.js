import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a business name']
  },
  email: {
    type: String,
    required: [true, 'Please add a business email'],
    unique: true,
  },
  logo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add a business description']
  },
  industry: {
    type: String,
    required: [true, 'Please specify your industry']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact number']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please add your business registration number']
  },
  taxId: {
    type: String,
    required: [true, 'Please add your tax ID']
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
businessSchema.index({ name: 'text', description: 'text' });
businessSchema.index({ owner: 1 });
businessSchema.index({ 'address.city': 1, 'address.country': 1 });

export default mongoose.models.Business || mongoose.model('Business', businessSchema);