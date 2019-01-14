import {
  Entity, Column, OneToOne, OneToMany, JoinColumn, ManyToMany, JoinTable
} from "typeorm";

import { Model } from "./Model";
import { Table } from "./Table";
import { TransactionItem } from "./TransactionItem";

@Entity()
export class Transaction extends Model {

  @OneToMany(type => TransactionItem, item => item.transaction)
  items: TransactionItem[];

  @OneToOne(type => Table)
  @JoinColumn()
  table: Table;

  @Column({
    type: `varchar`,
    nullable: true
  })
  paymentMethod: string;

  @Column({
    type: `decimal`,
    precision: 11,
    scale: 2,
    default: 0
  })
  discount: number;

  @Column({
    type: `decimal`,
    precision: 11,
    scale: 2,
    nullable: true
  })
  paymentAmount: number;

  @Column({
    type: `decimal`,
    precision: 11,
    scale: 2
  })
  total: number;

  // For More Information in Payment Method ex: EDC Transaction ID
  @Column({
    type: `text`,
    nullable: true
  })
  paymentRemarks: string;

  @Column({
    type: `varchar`,
    default: `waiting_for_payment`
  })
  state: string;
}