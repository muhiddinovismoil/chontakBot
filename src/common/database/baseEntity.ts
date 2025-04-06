import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    name: 'created_at',
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
