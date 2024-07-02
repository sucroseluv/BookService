import { User } from "@prisma/client";
import { Exclude, Expose, Type, Transform } from "class-transformer";
import {
  IsAlphanumeric,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  Validate,
} from "class-validator";
import { Groups } from "../middlewares/validate-body.middleware";
import { IsNumberOrString } from "../utils/is-number-or-string.util";
import { Exception } from "./exception.model";
import { StatusCodes } from "http-status-codes";

@Exclude()
export class UserModel implements User {
  constructor(data: User) {
    Object.assign(this, data);
  }

  @Expose({ groups: Groups.ALL, toPlainOnly: true })
  @IsOptional({ groups: [Groups.CREATE, Groups.UPDATE, Groups.AUTH] })
  @IsInt({ groups: Groups.ALL })
  id: number;

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE, Groups.AUTH] })
  @IsString({ groups: Groups.ALL })
  @Length(5, 30, {
    groups: Groups.ALL,
  })
  @IsAlphanumeric("en-US", {
    groups: Groups.ALL,
  })
  username: string;

  @Expose({ toClassOnly: true })
  @IsOptional({ groups: [Groups.UPDATE] })
  @IsNotEmpty({ groups: [Groups.CREATE, Groups.AUTH] })
  @MaxLength(30)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 1,
    },
    { groups: Groups.ALL }
  )
  password: string;

  @Expose({ groups: Groups.ALL })
  @IsOptional({ groups: [Groups.UPDATE, Groups.AUTH] })
  @IsNotEmpty({ groups: [Groups.CREATE] })
  @IsEmail({}, { groups: Groups.ALL })
  email: string;

  @Expose({ groups: Groups.ALL })
  @Transform(
    ({ value }) => {
      if (typeof value === "string") {
        const parsed = parseInt(value, 2);
        if (isNaN(parsed))
          throw new Exception(StatusCodes.BAD_REQUEST, "Wrong role format");
        return parsed;
      }
      return value;
    },
    { groups: [Groups.UPDATE] }
  )
  @IsOptional({ groups: [Groups.CREATE, Groups.AUTH, Groups.READ] })
  @IsNotEmpty({ groups: [Groups.UPDATE] })
  @Validate(IsNumberOrString, { groups: Groups.ALL })
  role: number;

  @Expose({ toPlainOnly: true })
  active: boolean;

  @Expose({ groups: Groups.ALL, toPlainOnly: true })
  createdAt: Date;

  @Expose({ groups: Groups.ALL, toPlainOnly: true })
  updatedAt: Date;
}
