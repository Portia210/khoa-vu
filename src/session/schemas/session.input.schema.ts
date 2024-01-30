import mongoose from "mongoose";

const sessionInputSchema = new mongoose.Schema(
  {
    bookingJobId: String,
    travelorJobId: String,
    destination: Object,
    checkInDate: Date,
    checkOutDate: Date,
    guests: String,
    adult: Number,
    children: Number,
    childrenAges: Array,
    rooms: Number,
  },
  {
    timestamps: true,
    typeKey: "$type",
  }
);

const SessionInput =
  mongoose.models.SessionInput ||
  mongoose.model("SessionInput", sessionInputSchema);
export default SessionInput;
