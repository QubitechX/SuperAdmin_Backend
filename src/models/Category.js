const mongoose = require('mongoose');
const Tag = require('./Tag');

const categorySchema = new mongoose.Schema(
  {
    name: {type: String,required: true,unique: true,trim: true},
    industryId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Industry'}]
  },
  { timestamps: true }
);

categorySchema.pre('findOneAndDelete', async function (next) {
  try {
    const category = await this.model.findOne(this.getFilter());
    if (category) {
      await Tag.deleteMany({ category: category._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
