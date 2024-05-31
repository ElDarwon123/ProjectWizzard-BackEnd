import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
    @Prop({ required: true })
    nombre: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
