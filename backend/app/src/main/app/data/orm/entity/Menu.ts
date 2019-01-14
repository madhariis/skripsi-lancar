import {
  Entity, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable
} from "typeorm";

import { Model } from "./Model";
import { Image } from "./Image";
import { MenuCategory } from "./MenuCategory";

@Entity()
export class Menu extends Model {

  @Column({
    type: `varchar`
  })
  title: string;

  @Column({
    type: `text`,
    nullable: true
  })
  description: string;

  @Column({
    type: `varchar`,
    default: 'available'
  })
  state: string;

  @Column({
    type: `decimal`,
    precision: 11,
    scale: 2
  })
  price: number;

  @Column({
    type: `int`,
    nullable: true
  })
  discount: number;

  @OneToMany(type => Image, image => image.menu)
  images: Image[];

  @ManyToOne(type => MenuCategory, category => category.menus)
  @JoinTable()
  category: MenuCategory[];
}