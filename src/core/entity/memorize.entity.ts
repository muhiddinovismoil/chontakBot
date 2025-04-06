import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common';
import { UserEntity } from './user.entity';

@Entity()
export class MemorizeEntity extends BaseEntity {
  @Column()
  content: string;

  @Column()
  key: string;

  @Column()
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.memorized)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
