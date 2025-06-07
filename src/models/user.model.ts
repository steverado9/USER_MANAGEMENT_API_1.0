import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Role from "./role.model";
import UserRole from "./userRole.model";

@Table({
    tableName: "users",
})
export default class User extends Model {
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

    @Column({
        type: DataType.STRING(255),
        field: "username",
        allowNull: false
    })
    username!: string

    @Column({
        type: DataType.STRING(255),
        field: "email",
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.STRING(255),
        field: "password",
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.JSON,
        field: "address"
    })
    address?: Record<string, any> //this is a way of writing object in typescript

    @Column({
        type: DataType.STRING(255),
        field: "phone"
    })
    phone?: string;

    @Column({
        type: DataType.STRING(255),
        field: "website"
    })
    website?: string;

    @Column({
        type: DataType.JSON,
        field: "company"
    })
    company?: Record<string, any>;

    @BelongsToMany(() => Role, () => UserRole)
    roles!: Role[];
}

