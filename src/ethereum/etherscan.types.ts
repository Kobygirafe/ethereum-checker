export type BlockNumber = {
    jsonrpc: number;
    id: number;
    result: string;
}

export type BlockTransactions = {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    r: string;
    s: string;
    to: string;
    transactionIndex: string;
    type: string;
    v: string;
    value: string;
}

export type BlockInfo = {
    jsonrpc: number;
    id: number;
    result: {
        baseFeePerGas: string;
        difficulty: string;
        extraData: string;
        gasLimit: string;
        gasUsed: string;
        hash: string;
        logsBloom: string;
        miner: string;
        mixHash: string;
        nonce: string;
        number: string;
        parentHash: string;
        receiptsRoot: string;
        sha3Uncles: string;
        size: string;
        stateRoot: string;
        timestamp: string;
        totalDifficulty: string;
        transactions: BlockTransactions[];
        transactionsRoot: string;
        uncles: string[];
    };
}