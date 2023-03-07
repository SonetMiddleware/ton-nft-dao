import {Address, beginCell, Cell} from "ton-core";
import * as BN from "bn.js";

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}
export type NftCollectionData = {
    ownerAddress: Address,
    nextItemIndex: number
    collectionContent: string
    commonContent: string
    nftItemCode: Cell
    royaltyParams: RoyaltyParams
}

export function buildInitDataCell(data: NftCollectionData) {
    return beginCell().storeAddress(data.ownerAddress)
        .storeUint(data.nextItemIndex, 64)
        .storeRef(
            beginCell().storeRef(
                beginCell().storeBuffer(Buffer.from(data.collectionContent)).endCell()
            ).storeRef(
                beginCell().storeBuffer(Buffer.from(data.commonContent)).endCell()
            ).endCell()
        ).storeRef(
            data.nftItemCode
        ).storeRef(
            beginCell().storeUint(data.royaltyParams.royaltyFactor, 16)
                .storeUint(data.royaltyParams.royaltyBase, 16)
                .storeAddress(data.royaltyParams.royaltyAddress)
                .endCell()
        ).endCell()
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
    let chunks: Buffer[] = []
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize))
        buff = buff.slice(chunkSize)
    }
    return chunks
}


