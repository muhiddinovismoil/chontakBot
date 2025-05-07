// import { Entity, Column, OneToMany } from 'typeorm';
// import { BaseEntity } from '@/common';
// import { MemorizeEntitya } from './memorize.schema';

// @Entity({
//   name: 'users',
// })
// export class UserEntity {
//   @Column()
//   telegram_id: string;

//   @Column()
//   first_name: string;

//   @Column()
//   last_name: string;

//   @OneToMany(() => MemorizeEntity, (memo) => memo.user)
//   memorized: MemorizeEntity[];
// }

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ name: 'telegram_id', type: String })
  telegram_id: string;

  @Prop({ name: 'first_name', type: String })
  first_name: string;

  @Prop({ name: 'last_name', type: String })
  last_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
