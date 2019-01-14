import {
  Entity, Column, ManyToOne
} from "typeorm";

import { Model } from "./Model";
import { Menu } from "./Menu";

@Entity()
export class Image extends Model {

  @Column({
    type: `varchar`,
  })
  name: string;

  @Column({
    type: `longtext`,
  })
  imageData: string;

  @ManyToOne(type => Menu, menu => menu.images)
  menu: Menu;

}