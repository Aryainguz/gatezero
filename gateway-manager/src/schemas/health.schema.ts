import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type HealthDocument = Health & Document;

@Schema({ collection: "health_checks" })
export class Health {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  details?: Record<string, any>;
}

export const HealthSchema = SchemaFactory.createForClass(Health);
