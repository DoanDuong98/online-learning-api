import { Exclude } from 'class-transformer';
import Permission from 'src/modules/users/permission/permission.type';
import Role from 'src/modules/users/enum/role.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
 
@Entity({ name: "users" })
class User {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;
 
  @Column({ unique: true, nullable: false })
  @Exclude()
  password: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

  @Column()
  public stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User]
  })
  public roles: Role[]

  @Column({
    type: 'enum',
    enum: Permission,
    array: true,
    default: []
  })
  public permissions: Permission[]

  @CreateDateColumn()
  created_at: Date

  @DeleteDateColumn()
  deleted_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
 
export default User;
