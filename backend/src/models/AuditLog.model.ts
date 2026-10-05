import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  userId: string;
  resourceId?: string;
  details: any;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  userId: { type: String, required: true },
  resourceId: { type: String },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
