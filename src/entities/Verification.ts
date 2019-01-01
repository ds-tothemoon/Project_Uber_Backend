import { 
    BaseEntity,
    CreateDateColumn,
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    BeforeInsert,
} from "typeorm";
import { verificationTarget } from "../types/types";

@Entity()
class Verification extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text", enum: ["PHONE", "EMAIL"] }) // 1.Type 지정, 2. enum 지정
    target: verificationTarget;

    @Column({ type: "text" })
    payload: string;

    @Column({ type: "text" })
    key: string;

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;

    @BeforeInsert()
    createKey(): void {
        if (this.target === "PHONE"){
            this.key = Math.floor(Math.random() * 100000).toString();
        } else if (this.target === "EMAIL"){ 
            this.key = Math.random().toString(36).substr(2);
        }
    }
}

export default Verification;