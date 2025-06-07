import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import User from "./user.model";
import UserRole from "./userRole.model";

@Table({
    tableName: "roles",
})

export default class Role extends Model {
    public static readonly VALID_ROLES = ["user", "admin", "moderator"];

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id!: number

    @Column({
        type: DataType.STRING(255),
        field: "name",
        allowNull: false
    })
    name!: string

    @BelongsToMany(() => User, () => UserRole)
    users!: User[];
}