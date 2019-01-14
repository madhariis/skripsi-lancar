import {
  Entity, Column, OneToOne, OneToMany, JoinColumn, ManyToMany, JoinTable
} from "typeorm";

import { Model } from "./Model";
import { Menu } from "./Menu";
import { Table } from "./Table";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order extends Model {

  @OneToMany(type => OrderItem, item => item.order)
  items: OrderItem[];

  @OneToOne(type => Table)
  @JoinColumn()
  table: Table;

  @Column({
    type: `varchar`,
    default: `open`
  })
  state: string;
}