import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  @Field(() => ID)
  id: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  @Field(() => String, { nullable: true })
  name?: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 100,
  })
  @Field(() => String, { nullable: true })
  email?: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 150,
  })
  @Field(() => String, { nullable: true })
  image?: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 250,
  })
  @Field(() => String, { nullable: true })
  about?: string;
}
