import { IsInt, Min, Max, IsOptional, IsString, Length } from 'class-validator';

export class eventDto {
  @IsString()
  @Length(1, 256)
  file: string;

//   @IsOptional()
  @IsInt()
  @Min(0)         // 0 이상
//   @Max(360)       // 360 이하
//   bearing?: number;
  bearing: number;

  @IsString()
  @Length(1, 32)
  state: string;
}
