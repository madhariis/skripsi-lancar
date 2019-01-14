import {
  Entity, Column, Index
} from "typeorm";

import { Model } from "./Model";

@Entity()
export class Table extends Model {

  @Column({
    type: `varchar`,
    nullable: true,
  })
  title: string;

  @Index({ unique: true })
  @Column({
    type: `varchar`,
  })
  uniqueCode: string;

  @Column({
    type: `int`,
    default: 0
  })
  capacity: number;

  @Column({
    type: `varchar`,
    default: 'empty',
  })
  state: string;

  @Column({
    type: `text`,
    nullable: true,
  })
  qrCode: string;

  @Column({
    type: `text`,
    nullable: true,
  })
  qrCodeLink: string;

  @Column({
    type: `timestamp`,
    nullable: true,
  })
  registeredDate: Date;

}