import {
  Entity, Column, OneToOne, ManyToOne, JoinColumn, JoinTable
} from "typeorm";

import { Model } from "./Model";
import { Transaction } from "./Transaction";
import { Menu } from "./Menu";

@Entity()
export class TransactionItem extends Model {

  @ManyToOne(type => Transaction, transaction => transaction.items)
  transaction: Transaction;

  @OneToOne(type => Menu)
  @JoinColumn()
  menu: Menu;

  @Column({
    type: `int`,
    default: 0
  })
  qty: number;

  @Column({
    type: `decimal`,
    precision: 11,
    scale: 2
  })
  total: number;
}