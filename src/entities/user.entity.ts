import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
 
@Entity({ name: "users" })
class User {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ unique: true, nullable: false })
  email: string;
 
  @Column({ unique: true, nullable: false })
  password: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
 
export default User;
