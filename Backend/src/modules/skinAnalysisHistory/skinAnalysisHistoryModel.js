const mongoose = require("mongoose");

//
// Re-use or redefine your sub-schemas:
//
const DetectionObjectSchema = new mongoose.Schema({
  bbox: {
    type: [Number], 
    validate: [v => v.length === 4, "bbox must be [x,y,w,h]"],
    required: true,
  },
  confidence: { type: Number, required: true },
}, { _id: false });

const DetectionsSchema = new mongoose.Schema({
  acne:       { objects: [DetectionObjectSchema], default: [] },
  puffy_eyes: { objects: [DetectionObjectSchema], default: [] },
}, { _id: false });

const ClassificationSchema = new mongoose.Schema({
  label:      { type: String, required: true },
  score:      { type: Number, required: true },
  all_scores: { type: Map, of: Number, required: true },
}, { _id: false });

const ClassificationsSchema = new mongoose.Schema({
  acne_severity: ClassificationSchema,
  skin_type:     ClassificationSchema,
}, { _id: false });

const SkinAnalysisHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,             // speed up lookups by user
  },
scanned_image_before: {
  type: String, // cloudinary URL of uploaded image
  required: true,
},
scanned_image_after: {
  type: String, // optional postprocessed version (e.g., annotated by AI)
  required: false,
},
 isProgressTracking: {
    type: Boolean,
    default: false,
    index: true,         // optional – helps if you query by it
  },
  detections:      { type: DetectionsSchema, required: true },
  classifications: { type: ClassificationsSchema, required: true },

  // optional extra insights
  hydrationLevel:  { type: Number, min: 0, max: 1 },
  uvExposureIndex: { type: Number, min: 0 },

 recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecommendationProduct"
    }
  ],
  analyzedAt: { type: Date, default: Date.now, index: true },
}, {
  timestamps: false,         // we already have analyzedAt
  collection: "skinAnalysisHistory"
});

module.exports = mongoose.model(
  "SkinAnalysisHistory",
  SkinAnalysisHistorySchema
);
