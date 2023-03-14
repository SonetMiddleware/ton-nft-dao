import {contractAddress, toNano, TonClient, WalletContractV3R2} from "ton";
import {mnemonicToPrivateKey} from "ton-crypto";
import {api_key, mnemonic} from "../env.json";
import {Address, beginCell, Cell} from "ton-core";
import * as fs from "fs";

async function createDao() {
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    const daoCode = fs.readFileSync("./dao-data.cell");
    let codeCell = Cell.fromBoc(daoCode)[0];
    let dataCell = beginCell()
        .storeAddress(Address.parse('kQCWsaU-piIXzA4MlbcRabYfWJXrjcq-9e9gnwB7pfSz8jdG'))
        .storeRef(beginCell().storeBuffer(Buffer.from("test-collection-id")))
        .storeRef(beginCell().storeBuffer(Buffer.from("test-collection-name")))
        .storeRef(beginCell().storeBuffer(Buffer.from("test-tg")))
        .storeRef(beginCell().storeBuffer(Buffer.from("test-twitter")))
        .endCell()
    let stateInitCell=beginCell().storeRef(codeCell).storeRef(dataCell).endCell();
    console.log(stateInitCell.toBoc().toString('base64'));
    let address = contractAddress(0, {code: codeCell, data: dataCell})
    console.log(address);
    await walletContract.sendTransfer({
        seqno: await walletContract.getSeqno(),
        secretKey: key.secretKey,
        messages: [{
            info: {
                type: 'internal',
                ihrDisabled: false,
                bounce: false,
                bounced: false,
                dest: address,
                value: {coins: toNano("0.05")},
                ihrFee: toNano(0),
                forwardFee: toNano(0),
                createdLt: toNano(0),
                createdAt: 0
            },
            init: {code: codeCell, data: dataCell},
            body: new Cell()
        }]
    });
}

createDao().then(() => process.exit(0)).catch(e => console.log(e))
