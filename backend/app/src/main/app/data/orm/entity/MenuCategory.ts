import {
    Entity, Column, OneToMany
} from "typeorm";

import { Model } from "./Model";
import { Menu } from "./Menu";

@Entity()
export class MenuCategory extends Model {

    @Column({
        type: `varchar`,
    })
    title: string;

    @OneToMany(type => Menu, menu => menu.category)
    menus: Menu[];
}