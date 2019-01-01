import bcrypt from "bcrypt-nodejs";
import { IsEmail, } from "class-validator";
import {
    BaseEntity, 
    BeforeInsert,
    BeforeUpdate, 
    Column, 
    CreateDateColumn, 
    Entity,
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";

const BCRYPT_ROUNDS = 10; // 몇 번이나 암호화 할 건지

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text", unique: true })
    @IsEmail()
    email: true;

    @Column({ type: "boolean", default: false })
    verifiedEmail: boolean;

    @Column({ type: "text" })
    firstName: string;

    @Column({ type: "text" })
    lastName: string;

    @Column({ type: "int" })
    age: number;

    @Column({ type: "text" })
    password: string;

    @Column({ type: "text" })
    phoneNumber: string;

    @Column({ type: "boolean", default: false })
    verifiedPhonenNumber: boolean;

    @Column({ type: "text" })
    profilePhoto: string;

    @Column({ type: "boolean", default: false })
    isDriving: boolean;

    @Column({ type: "boolean", default: false })
    isRiding: boolean;

    @Column({ type: "boolean", default: false })
    isTaken: boolean;

    @Column({ type: "double precision", default: 0 }) // float
    lastLng: number;
    
    @Column({ type: "double precision", default: 0 })
    lastLat: number;
    
    @Column({ type: "double precision", default: 0 })
    lastOrientation: number;

    @ManyToOne(type => Chat, chat => chat.participants)
    chat: Chat;

    @OneToMany(type => Message, message => message.user)
    messages: Message[];

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public comparePassword(password: string, hashString: string): Promise<boolean>{
        return new Promise(function(resolve, reject) {
            const result = bcrypt.compareSync(password, hashString);
            resolve(result);
          });
    }

    @BeforeInsert()
    @BeforeUpdate()
    async savePassword(): Promise<void> {
      if (this.password) {
        const hashedPassword = await this.hashPassword(this.password);
        this.password = hashedPassword;
      }
    }
  
    private hashPassword(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS);
        return new Promise(function(resolve, reject) {
          const hashedPassword = bcrypt.hashSync(password, salt);
          if (hashedPassword) {
            resolve(hashedPassword);
          }
          reject(new Error("Hashed Failed"));
        });
      }
}

export default User;