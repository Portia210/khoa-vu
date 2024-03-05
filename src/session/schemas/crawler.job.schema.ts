import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { CRAWLER_STATUS } from "../constants";

export type CrawlerJobDocument = CrawlerJob;

@Schema({ timestamps: true })
export class CrawlerJob extends Document {
  @Prop({ type: String })
  dataSource: string;

  @Prop({ type: String })
  sessionId: string;

  @Prop({ type: String })
  countryCode: string;

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

  @Prop({ default: CRAWLER_STATUS.PENDING })
  status: CRAWLER_STATUS;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  message: object | string;

  @Prop({ type: String })
  assignedTo: string;
}

export const CrawlerJobSchema = SchemaFactory.createForClass(CrawlerJob);
