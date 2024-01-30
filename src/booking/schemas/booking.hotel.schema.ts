import mongoose from "mongoose";

const bookingHotelSchema = new mongoose.Schema(
  {
    title: String,
    picture_link: Object,
    booking_link: String,
    price: Object,
    rate: Number,
    reviews: Object,
    stars: Number,
    distance: Object,
    jobId: String,
  },
  {
    timestamps: true,
  }
);

const BookingHotel =
  mongoose.models.BookingHotel ||
  mongoose.model("BookingHotel", bookingHotelSchema);
export default BookingHotel;
