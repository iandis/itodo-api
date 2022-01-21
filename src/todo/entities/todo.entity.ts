import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TodoStatus } from '../dto/shared/todo-status.enum';

@Entity('todos')
export class Todo extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  id: string;

  @ManyToOne(() => String)
  @Column({
    type: 'varchar',
    length: 50,
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 25,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  subtitle: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  status: TodoStatus;

  @Column({
    type: 'date',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'date',
    name: 'updated_at',
  })
  updatedAt: Date;
}
