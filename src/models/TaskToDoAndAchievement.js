const mongoose = require("mongoose");
const { Schema } = mongoose;
const s3Url = process.env.AWS_S3_URL;

const TaskToDoAndAchievementSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Task To Do', 'Achievements', 'other'],
    default: 'Task To Do'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  duration: {
    type: String,
    default: null,
  },
  startingRange: {
    type: Number,
    default: null,
  },
  endingRange: {
    type: Number,
    default: null,
  },
  points: {
    type: Number,
    default: 0,
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Industry", 
    required: true 
  },
  imageUrl: {
    type: String,
    default: null,
    set: function(value) {
      if (value && value.startsWith(s3Url)) {
        return value.replace(s3Url, '');
      }
      return value;
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});


const TaskToDoAndAchievement = mongoose.model('TaskToDoAndAchievement', TaskToDoAndAchievementSchema);

module.exports = TaskToDoAndAchievement;