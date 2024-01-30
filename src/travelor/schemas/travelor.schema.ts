import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TravelorHotelDocument = TravelorHotel;

@Schema({ timestamps: true })
export class TravelorHotel extends Document {
  @Prop({ required: true, type: String })
  hotel_id: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Object })
  picture_link: object;

  @Prop({ required: true, type: String })
  travelor_link: string;

  @Prop({ required: true, type: Object })
  price: object;

  @Prop({ required: true, type: Number })
  stars: number;

  @Prop({ required: true, type: Object })
  country: object;

  @Prop({ required: true, type: Object })
  facilities: object;

  @Prop({ required: true, type: Object })
  reviews: object;

  @Prop({ required: true, type: String })
  jobId: string;
}

export const TravelorHotelSchema = SchemaFactory.createForClass(TravelorHotel);
