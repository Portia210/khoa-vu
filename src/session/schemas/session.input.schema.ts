import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SessionInputDocument = SessionInput;

@Schema({ timestamps: true, typeKey: "$type" })
export class SessionInput extends Document {
  @Prop({ type: String })
  bookingJobId: string;

  @Prop({ type: String })
  travelorJobId: string;

  @Prop({ type: Object })
  destination: object;

  @Prop({ type: Date })
  checkInDate: Date;

  @Prop({ type: Date })
  checkOutDate: Date;

  @Prop({ type: String })
  guests: string;

  @Prop({ type: Number })
  adult: number;

  @Prop({ type: Number })
  children: number;

  @Prop({ type: [Number] })
  childrenAges: number[];

  @Prop({ type: Number })
  rooms: number;
}
export const SessionInputSchema = SchemaFactory.createForClass(SessionInput);
