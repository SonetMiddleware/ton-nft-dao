import {Address, beginCell, Cell, Contract, ContractProvider, Sender} from "ton-core";

export const OperationCodes = {
    Mint: 1,
    BatchMint: 2,
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad
}

export default class Collection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.1", // send 0.1 TON to contract for rent
            bounce: false
        });
    }

    async sendMintNFT(provider: ContractProvider, via: Sender, body: Uint8Array) {
        await provider.internal(via, {
            value: "0.08", // send 0.08 TON to contract for gas fee
            bounce: false,
            body: Cell.fromBoc(Buffer.from(body))[0],
        });
    }
}
