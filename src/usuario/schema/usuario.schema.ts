import { Schema ,Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from "src/role/schema/role.schema";

@Schema()
export class Usuario extends Document{
    @Prop({required: true})
    nombre: String
    @Prop({ required: true })
    apellido: String
    @Prop({ required: true })
    email: String
    @Prop({ required: true })
    numIdentificacion: String
    @Prop()
    telefono: String
    @Prop({default: Date.now()})
    fechaNacimieto: Date
    @Prop()
    caracterizacion: String
    @Prop()
    contrasena: String
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role'})
    role: Role
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario)