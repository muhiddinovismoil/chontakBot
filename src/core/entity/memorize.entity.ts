import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Media } from '@/common';
import { UserEntity } from './user.entity';

@Entity({
  name: 'memorize',
})
export class MemorizeEntity extends BaseEntity {
  @Column({ name: 'content', type: 'varchar' })
  content: string;

  @Column({ name: 'key', type: 'varchar' })
  key: string;

  @Column({ name: 'type', enum: Media, type: 'enum' })
  type: Media;

  @Column({ name: 'user_id', type: 'varchar' })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.memorized)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
