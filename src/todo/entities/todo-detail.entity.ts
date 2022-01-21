import { Column, Entity } from 'typeorm';
import { Todo } from './todo.entity';

@Entity('todos')
export class TodoDetail extends Todo {
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
}
