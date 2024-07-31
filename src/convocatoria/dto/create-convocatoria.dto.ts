import { IsDateString, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { estadoConvocatoria } from "src/enums/convocatoria.enum";

export class CreateConvocatoriaDto {
    @IsDateString()
    @IsNotEmpty()
    fechaInicio: Date;
    @IsNotEmpty()
    @IsString()
    descripcion: string;
    @IsNotEmpty()
    @IsDateString()
    fechaCierre: string;
    @IsNotEmpty()
    @IsEnum(estadoConvocatoria)
    estado: estadoConvocatoria
}
