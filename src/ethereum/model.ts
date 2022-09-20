import {DataTypes, Model, Sequelize, BuildOptions} from 'sequelize';
import {dbConnect} from "../database";

export interface TransactionsAttributes {
    block: number,
    from: string,
    to: string,
    value: number,
}

export interface TransactionsBlocksAttributes {
    block: number,
}

export interface TransactionsModel extends Model<TransactionsAttributes>, TransactionsAttributes {}
export class Transaction extends Model<TransactionsModel, TransactionsAttributes> {}

export type TransactionsStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TransactionsModel;
};

export function TransactionsFactory (sequelize: Sequelize): TransactionsStatic {
    return <TransactionsStatic>sequelize.define("transactions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        block: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        value: {
            type: DataTypes.FLOAT,
        }
    }, {
        timestamps: false,
    });
}

export const Transactions = TransactionsFactory(dbConnect);