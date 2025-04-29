import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common';
import { MemorizeEntity } from './memorize.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @Column({ name: 'telegram_id', type: 'varchar' })
  telegram_id: string;

  @Column({ name: 'first_name', type: 'varchar' })
  first_name: string;

  @Column({ name: 'last_name', type: 'varchar' })
  last_name: string;

  @OneToMany(() => MemorizeEntity, (memo) => memo.user)
  memorized: MemorizeEntity[];
}
