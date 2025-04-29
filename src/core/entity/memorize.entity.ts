import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Media } from '@/common';
import { UserEntity } from './user.entity';

@Entity({
  name: 'memorize',
})
export class MemorizeEntity extends BaseEntity {
  @Column()
  content: string;

  @Column()
  key: string;

  @Column({ enum: Media, type: 'enum' })
  type: Media;

  @Column()
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.memorized)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
