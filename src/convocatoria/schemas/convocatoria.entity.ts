import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';

export class AnnouncementTemplate {
  @ApiProperty({ type: String, example: 'Planteamiento del problema' })
  title: string[];
}
@Schema()
export class Convocatoria extends Document {
  @ApiProperty({ type: Date, example: '2025-06-2015' })
  @Prop({
    required: true,
    set: (value: string) => new Date(value),
  })
  fechaInicio: Date;

  @ApiProperty({
    type: String,
    example: 'Proyectos sobre el campo colombiano',
  })
  @Prop({
    required: true,
    type: String,
  })
  title: string;

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

  @ApiProperty({example: 'Insertar un archivo que contenga información sobre la convocatoria'})
  @Prop({ type: [String], required: false })
  files?: String[];

  @ApiProperty({ type: AnnouncementTemplate, examples: AnnouncementTemplate })
  @Prop()
  template: AnnouncementTemplate[];
}

export const convocatoriaSchema = SchemaFactory.createForClass(Convocatoria);
