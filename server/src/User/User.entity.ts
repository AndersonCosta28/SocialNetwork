import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import bcrypt from "bcrypt"
import { UserStates } from "common/Types/User"
import Profile from "Profile/Profile.entity"

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  	id: number

  @Column({ unique: true })
  	Login: string

  @Column()
  	Password: string

  @Column({ unique: true, nullable: false })
  	Email: string

  @Column({ type: "enum", enum: UserStates, default: UserStates.WaitingForActivation })
  	State: UserStates

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  	Profile: Profile

  // @Column()
  // Level: number

  // @Column()
  // EXP: number

  @BeforeInsert()
  async BeforeInsert() {
  	this.Login = this.Login.toLowerCase().trim()
  	this.Password = await bcrypt.hash(this.Password, 10)
  	this.Email = this.Email.toLowerCase().trim()
  }
  // Quando atualizarmos o nível ou outra coisa do usuário terá que ser feito endpoints diferente para isso para não ter que Hashear uma senha hash
  // Não foi criado uma outra tabela para isso para não confundir os ID's, por que a relação é de um para um, então fica meio reduntante
  /*
  @BeforeUpdate()
  async BeforeUpdate() {
    this.Password = await bcrypt.hash(this.Password, 10)
  }
  */
}
