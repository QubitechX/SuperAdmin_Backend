const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  state_id: {
    type: Schema.Types.ObjectId,
    ref: 'State',
    required: true,
    index: true
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// citySchema.index({ name: 1, state: 1 }, { unique: true });
// citySchema.virtual('country', {
//   ref: 'Country',
//   localField: 'state',
//   foreignField: '_id',
//   justOne: true
// });

// citySchema.pre('save', async function(next) {
//   try {
//     const stateExists = await mongoose.model('State').exists({ _id: this.state });
//     if (!stateExists) {
//       throw new Error(`State with ID ${this.state} does not exist`);
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const City = mongoose.model('City', citySchema);

module.exports = City;