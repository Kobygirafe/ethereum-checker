import fetch from 'node-fetch';
import {BlockInfo, BlockNumber} from "./etherscan.types";

export interface IEtherscanClient {
    getLastBlock(): Promise<BlockNumber>,
    getTransaction(number: string): Promise<BlockInfo>,
}

export class EtherscanClient implements IEtherscanClient {
    key: string;
    path = 'https://api.etherscan.io/';

    constructor(key: string) {
        this.key = key
    }

    async getLastBlock(): Promise<BlockNumber> {
        try {
            const options = {
                'method': 'GET',
                'url': this.path + `api?module=proxy&action=eth_blockNumber&apikey=` + this.key,
            };

            const response = await fetch(options.url, {
                method: options.method,
            })

            return response.json()
        } catch (e) {
            console.log(e)
            return {
                jsonrpc: 2.0,
                id: 1,
                result: '0x0',
            }
        }
    }

    async getTransaction(number: string): Promise<BlockInfo> {

        const options = {
            'method': 'GET',
            'url': this.path + `api?module=proxy&apikey=${this.key}&action=eth_getBlockByNumber&tag=${number}&boolean=true`,
        };

        const response = await fetch(options.url, {
            method: options.method,
        })

        return response.json()
    }
}