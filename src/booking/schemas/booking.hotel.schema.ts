import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookingHotelDocument = BookingHotel;

@Schema({ timestamps: true })
export class BookingHotel extends Document {
  @Prop({ type: String })
  title: string;

  @Prop({ type: Object })
  picture_link: object;

  @Prop({ type: String })
  booking_link: string;

  @Prop({ type: Object })
  price: object;

  @Prop({ type: Number })
  rate: number;

  @Prop({ type: Object })
  reviews: object;

  @Prop({ type: Number })
  stars: number;

  @Prop({ type: Object })
  distance: object;

  @Prop({ type: String })
  jobId: string;
}

export const BookingHotelSchema = SchemaFactory.createForClass(BookingHotel);
