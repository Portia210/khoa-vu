import mongoose from "mongoose";

const crawlerJobSchema = new mongoose.Schema(
  {
    dataSource: String,
    sessionId: String,
    countryCode: String,
    destination: Object,
    checkInDate: Date,
    checkOutDate: Date,
    guests: String,
    adult: Number,
    children: Number,
    childrenAges: Array,
    rooms: Number,
    status: String,
    message: mongoose.Schema.Types.Mixed, // Allow either Object or String
    assignedTo: String, // Worker ID
  },
  {
    timestamps: true,
    typeKey: "$type",
  }
);

const CrawlerJob =
  mongoose.models.CrawlerJob || mongoose.model("CrawlerJob", crawlerJobSchema);
export default CrawlerJob;
