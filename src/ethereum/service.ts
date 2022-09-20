import {ITransactionRepository, TransactionRepository} from "./repository";
import {BlockInfo} from "./etherscan.types";
import {EtherscanClient, IEtherscanClient} from "./etherscan.client";
import web3 from "web3";
import {ConfigService, IConfigService} from "../config/service";

interface IEthService {
    run(): void,
    getChangedAddress(): Promise<any>,
}

export class EthService implements IEthService {
    repository: ITransactionRepository
    etherscan: IEtherscanClient
    integrity: boolean
    config: IConfigService

    constructor() {
        this.config = new ConfigService();
        this.config.loadConfiguration();
        const apiKey = this.config.getKey();
        this.repository = new TransactionRepository();
        this.etherscan = new EtherscanClient(apiKey);
        this.integrity = false;
    }

    async run(): Promise<void> {
        setInterval(() => this.updater(), 3000)
    }

    async getChangedAddress(): Promise<{ address?: string, sum?: number }> {
        this.integrity = await this.checkIntegrity()
        if (this.integrity) {
            return await this.repository.getChangedAddress()
        } else {
            return {}
        }
    }

    private async storeBlock(block: BlockInfo): Promise<void> {

        const { result: { transactions: rawTxs, number: blockNumber }} = block
        const blockId = web3.utils.hexToNumber(blockNumber);
        const txs = rawTxs.filter(el => {
            return el.value !== '0x0'
        }).map(el => {
            return {
                from: el.from,
                to: el.to,
                value: parseFloat(web3.utils.fromWei(web3.utils.toBN(el.value))),
                block: blockId
            }
        })

        await this.repository.storeTransactions(txs)

    }

    private async checkIntegrity(): Promise<boolean> {

        const txs = await this.repository.getLastBlocksList()
        const blocksCount = this.config.getBlockCount()
        const targetDiff = EthService.getBlocksDiffForCount(blocksCount)
        if (txs.length === blocksCount) {

            const blocksList = txs.map(el => {
                return el.block - txs[blocksCount - 1].block
            })

            const sum = blocksList.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );

            if (sum === targetDiff) {
                return true
            }

        }

        return false

    }

    private async updater(): Promise<void> {
        if (!this.config) { this.config = new ConfigService(); this.config.loadConfiguration(); }
        if (!this.etherscan) this.etherscan = new EtherscanClient(this.config.getKey());
        if (!this.repository) this.repository = new TransactionRepository();
        const lastBlockFromApi = await this.etherscan.getLastBlock()
        const lastBlockFromApiId = web3.utils.hexToNumber(lastBlockFromApi.result);
        const lastBlockFromDb = await this.repository.getLastBlock()

        if (lastBlockFromApiId > lastBlockFromDb) {
            const block = await this.etherscan.getTransaction(lastBlockFromApi.result)
            await this.storeBlock(block)
            this.integrity = await this.checkIntegrity()
        }
    }

    private static getBlocksDiffForCount(count: number): number {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            blocks.push(i)
        }

        return blocks.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        );
    }

}