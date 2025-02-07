import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  image: {
    type: String,
  },
  // Additional profile fields
  company: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  // OAuth information
  provider: {
    type: String,
    required: true
  },
  providerId: {
    type: String,
    required: true
  },
  businessRole: {
    type: String,
    enum: ['owner', 'admin', 'employee', null],
    default: null
  },
  businesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  }]
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
