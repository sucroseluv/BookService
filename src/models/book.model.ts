import { Book, Genre } from "@prisma/client";
import { Exclude, Expose, Type, Transform } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { Groups } from "../middlewares/validate-body.middleware";

@Exclude()
export class BookModel implements Book {
  constructor(data: Book & { genres: Genre[] }) {
    Object.assign(this, data);
    if (data?.genres) {
      Object.assign(
        this.genres,
        data?.genres.map((genre) => genre.name)
      );
    }
  }

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.CREATE, Groups.UPDATE] })
  @IsInt({ groups: Groups.ALL })
  id: number;

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE] })
  @IsString({ groups: Groups.ALL })
  @Length(1, 255, {
    groups: Groups.ALL,
  })
  title: string;

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE] })
  @IsString({ groups: Groups.ALL })
  @Length(1, 255, {
    groups: Groups.ALL,
  })
  author: string;

  @Expose({ groups: Groups.ALL })
  @Transform(
    ({ value }) => {
      if (!value) return value;
      if (value?.length <= 10) {
        value += "T00:00:00.000Z";
      }
      return new Date(value);
    },
    { toClassOnly: true, groups: Groups.ALL }
  )
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE] })
  @IsISO8601({}, { groups: Groups.ALL })
  publicationDate: Date;

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE] })
  @IsArray({ groups: Groups.ALL })
  @IsString({ each: true, groups: Groups.ALL })
  genres: string[];

  @Expose({ groups: Groups.ALL, toPlainOnly: true })
  createdAt: Date;

  @Expose({ groups: Groups.ALL, toPlainOnly: true })
  updatedAt: Date;
}
