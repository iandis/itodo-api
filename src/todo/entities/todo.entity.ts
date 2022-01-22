import { User } from 'src/user/entities/user.entity';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { TodoStatus } from '../dto/shared/todo-status.enum';

@Entity('todos')
export class Todo extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  id: string;

  @OneToOne(() => User, (user) => user.id)
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
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    enumName: 'todo_status',
  })
  status: TodoStatus;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;
}
