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
            value: "0.1", // send 0.01 TON to contract for rent
            bounce: false
        });
    }

    async sendMintNFT(provider: ContractProvider, via: Sender, params: { queryId?: number, passAmount: bigint, itemIndex: number, itemOwnerAddress: Address, itemContent: string }) {
        let msgBody = beginCell().storeUint(OperationCodes.Mint, 32)
            .storeUint(params.queryId || 0, 64)
            .storeUint(params.itemIndex, 64)
            .storeCoins(params.passAmount);

        let itemContent = beginCell().storeBuffer(Buffer.from(params.itemContent));

        let nftItemMessage = beginCell().storeAddress(params.itemOwnerAddress)
            .storeRef(itemContent.endCell());

        msgBody.storeRef(nftItemMessage.endCell());


        await provider.internal(via, {
            value: "0.1", // send 0.01 TON to contract for rent
            bounce: false,
            body: msgBody.endCell()
        });

    }
}
