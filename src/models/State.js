const mongoose = require('mongoose');
const { Schema } = mongoose;

const stateSchema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  country_id: {
    type: Number,
    required: true,
    ref: 'Country'
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// stateSchema.index({ name: 1 });
// stateSchema.index({ country_id: 1 });
// stateSchema.index({ name: 1, country_id: 1 }, { unique: true });
// stateSchema.virtual('country', {
//   ref: 'Country',
//   localField: 'country_id',
//   foreignField: '_id',
//   justOne: true
// });
// stateSchema.virtual('cities', {
//   ref: 'City',
//   localField: '_id',
//   foreignField: 'state_id'
// });

// stateSchema.pre('save', async function(next) {
//   try {
//     const countryExists = await mongoose.model('Country').exists({ _id: this.country_id });
//     if (!countryExists) {
//       throw new Error(`Country with ID ${this.country_id} does not exist`);
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const State = mongoose.model('State', stateSchema);

module.exports = State;