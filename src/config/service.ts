import * as dotenv from "dotenv";

type DbInfo = {
    host: string,
    name: string,
    port: number,
    user: string,
    pass: string,
}

export interface IConfigService {
    loadConfiguration(): void;
    getKey(): string;
    getDB(): DbInfo;
    getBlockCount(): number;
}

export class ConfigService implements IConfigService{
    db: DbInfo
    apiKey: string
    blockCount: number

    constructor() {
        this.apiKey = 'none'
        this.blockCount = 10
        this.db = {
            host: 'localhost',
            name: 'eth',
            port: 3306,
            user: 'user',
            pass: 'password',
        }
    }

    loadConfiguration() {
        dotenv.config()
        this.apiKey = process.env.API_KEY || 'none'
        this.blockCount = parseInt(process.env.BLOCKS_COUNT || '10')
        this.db = {
            host: process.env.DB_HOST || 'localhost',
            name: process.env.DB_NAME || 'eth',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'user',
            pass: process.env.DB_PASS || 'password'
        }
    }

    getBlockCount(): number {
        return this.blockCount;
    }

    getDB(): DbInfo {
        return this.db;
    }

    getKey(): string {
        return this.apiKey;
    }

}