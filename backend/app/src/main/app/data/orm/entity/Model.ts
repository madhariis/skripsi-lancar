const emitter = require(`lib/emitter`);

import { 
  BaseEntity, Entity, Column, Generated,
  CreateDateColumn, UpdateDateColumn, VersionColumn,
  AfterInsert, AfterUpdate,
} from "typeorm";

export abstract class Model extends BaseEntity {

  @Column({
    type: `uuid`,
    primary: true
  })
  @Generated(`uuid`)
  id: string;

  @CreateDateColumn({
    select: false
  })
  createdDate: Date;

  @UpdateDateColumn({
    select: false
  })
  updatedDate: Date;

  fill(props) {
    for (const key in props) {
      this[key] = props[key];
    }
  }

  @AfterInsert()
  @AfterUpdate()
  didChanged() {
    emitter.emit(`data:didChanged`, this);
  }

}