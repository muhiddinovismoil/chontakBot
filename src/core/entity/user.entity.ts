import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common';
import { MemorizeEntity } from './memorize.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  telegram_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToMany(() => MemorizeEntity, (memo) => memo.user)
  memorized: MemorizeEntity[];
}
