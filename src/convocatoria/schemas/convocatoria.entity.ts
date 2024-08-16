import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';

export class AnnouncementTemplate {
  @ApiProperty({ type: String, example: 'Planteamiento del problema' })
  titlo: string;
}
@Schema()
export class Convocatoria extends Document {
  @ApiProperty()
  @Prop({
    required: true,
    set: (value: string) => new Date(value),
  })
  fechaInicio: Date;
  @ApiProperty({
    type: String,
    example: 'Se reciben proyectos orientados a mejorar la economía campesina',
  })
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
  @ApiProperty({ enum: estadoConvocatoria, examples: estadoConvocatoria })
  @Prop({
    enum: estadoConvocatoria,
    default: estadoConvocatoria.ACTIVE,
  })
  estado: estadoConvocatoria;
  @ApiProperty({ type: AnnouncementTemplate, examples: AnnouncementTemplate })
  @Prop()
  plantilla: AnnouncementTemplate[];
}

export const convocatoriaSchema = SchemaFactory.createForClass(Convocatoria);
