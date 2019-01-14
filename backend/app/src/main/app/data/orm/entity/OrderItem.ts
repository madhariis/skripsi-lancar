import {
  Entity, Column, OneToOne, ManyToOne, JoinColumn, JoinTable
} from "typeorm";

import { Model } from "./Model";
import { Order } from "./Order";
import { Menu } from "./Menu";

@Entity()
export class OrderItem extends Model {

  @ManyToOne(type => Order, order => order.items)
  order: Order;

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

  @Column({
    type: `varchar`,
    default: `queued`
  })
  state: string;

  @Column({
    type: `int`,
    default: 0
  })
  waiting: number;

  @Column({
    type: `int`,
    default: 0
  })
  onProgress: number;

  @Column({
    type: `int`,
    default: 0
  })
  readyToServe: number;

  @Column({
    type: `int`,
    default: 0
  })
  served: number;
}