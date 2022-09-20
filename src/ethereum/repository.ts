import {
    Transactions,
    TransactionsAttributes,
    TransactionsBlocksAttributes,
    TransactionsStatic
} from './model';
import {dbConnect} from '../database';
import {ConfigService, IConfigService} from "../config/service";

export interface ITransactionRepository {
    storeTransactions(transactions: TransactionsAttributes[]): Promise<void>,
    getLastBlock(): Promise<number>,
    getLastBlocksList(): Promise<TransactionsBlocksAttributes[]>,
    getChangedAddress(): Promise<any>,
}

export class TransactionRepository implements ITransactionRepository {
    db: TransactionsStatic
    config: IConfigService

    constructor() {
        this.db = Transactions;
        this.config = new ConfigService();
        this.config.loadConfiguration();
    }

    async getLastBlocksList(): Promise<TransactionsBlocksAttributes[]> {

        const limit = this.config.getBlockCount();
        return await this.db.findAll({
            attributes: [ 'block' ],
            order: [
                ['block', 'DESC'],
            ],
            group: 'block',
            limit,
        })

    }

    async getChangedAddress(): Promise<any> {

        const countBlocks = this.config.getBlockCount()

        const mostChangedQuery = `
            SELECT tmp.address, ROUND(SUM(tmp.sum), 8) As \`sum\`
            FROM (
                SELECT t.\`to\` As \`address\`, ROUND(SUM(value), 8) As \`sum\`
                FROM Transactions As t
                INNER JOIN (
                    SELECT block
                    FROM Transactions
                    GROUP BY block
                    ORDER BY block DESC
                    LIMIT ${countBlocks}
                    ) As t2
                ON t.block = t2.block
                GROUP BY t.\`to\`
                UNION ALL
                SELECT t.\`from\` As \`address\`, ROUND(SUM(-1 * value), 8) As \`sum\`
                FROM Transactions As t
                INNER JOIN (
                    SELECT block
                    FROM Transactions
                    GROUP BY block
                    ORDER BY block DESC
                    LIMIT ${countBlocks}
                    ) As t2
                ON t.block = t2.block
                GROUP BY t.\`from\`
                     ) As tmp
            GROUP BY address
            ORDER BY sum DESC
            LIMIT 1;`

        const address = await dbConnect.query(mostChangedQuery)
        return address[0][0]
    }

    async getLastBlock(): Promise<number> {
        const transaction = await this.db.findOne({
            order: [
                ['block', 'DESC'],
            ],
            limit: 1,
        })

        if (transaction) {
            return transaction.block
        } else {
            return 0
        }
    }

    async storeTransactions(transactions: TransactionsAttributes[]): Promise<void> {
        for (let i = 0; i < transactions.length; i++) {
            const { from, to , value, block } = transactions[i];
            await this.db.create({
                block,
                from,
                to,
                value,
            })
        }
    }


}