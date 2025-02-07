import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: [true, 'Please specify if this is a product or service']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  images: [{
    type: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  customizationAvailable: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  location: {
    city: String,
    state: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  type: 1,
  category: 1
});

export default mongoose.models.Product || mongoose.model('Product', productSchema); 