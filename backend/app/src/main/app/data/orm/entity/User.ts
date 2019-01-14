import {
  Entity, Column, Index
} from "typeorm";

import { Model } from "./Model";

@Entity()
export class User extends Model {

  @Column({
    type: `varchar`,
    nullable: true,
  })
  fullName: string;

  @Index({ unique: true })
  @Column({
    type: `varchar`,
  })
  username: string;

  @Index({ unique: true })
  @Column({
    type: `varchar`,
  })
  uniqueCode: string;

  @Column({
    type: `text`,
    nullable: true,
  })
  qrCode: string;

  @Column({
    type: `varchar`,
  })
  role: string;
}