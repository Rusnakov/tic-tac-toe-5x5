import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, MinLength } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ unique: true })
  @IsEmail()
  email: string = '';

  @Column()
  @MinLength(6)
  password: string = '';

  @Column()
  username: string = '';

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updateAt: Date = new Date();
}
