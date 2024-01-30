import mongoose from "mongoose";

const travelorHotelSchema = new mongoose.Schema(
  {
    hotel_id: String,
    title: String,
    picture_link: Object,
    travelor_link: String,
    price: Object,
    stars: Number,
    country: Object,
    facilities: Object,
    reviews: Object,
    jobId: String,
  },
  {
    timestamps: true,
  }
);

const TravelorHotel =
  mongoose.models.TravelorHotel ||
  mongoose.model("TravelorHotel", travelorHotelSchema);
export default TravelorHotel;