import { Prop, SchemaFactory, Schema} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';

@Schema()
export class Convocatoria extends Document {
  @ApiProperty()
  @Prop({
    required: true,
    set: (value: string) => new Date(value),
  })
  fechaInicio: Date;
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  descripcion: string;
  @ApiProperty()
  @Prop({
    required: true,
    set: (value: string) => new Date(value),
  })
  fechaCierre: Date;
  @ApiProperty()
  @Prop({
    required: true,
    enum: estadoConvocatoria,
    default: estadoConvocatoria.ACTIVE,
  })
  estado: estadoConvocatoria;
}

export const convocatoriaSchema = SchemaFactory.createForClass(Convocatoria);
