import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import User from "./user.model";
import Role from "./role.model";

@Table({
    tableName: "user_role",
    timestamps: false,
})
export default class UserRole extends Model {
    @ForeignKey(() => User)
    @Column({ primaryKey: true })
    userId!: number;

    @ForeignKey(() => Role)
    @Column({ primaryKey: true })
    roleId!: number;
}