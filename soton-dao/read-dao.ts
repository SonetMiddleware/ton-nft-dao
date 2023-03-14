import {Slice, TonClient, WalletContractV3R2} from "ton";
import {mnemonicToPrivateKey} from "ton-crypto";
import {api_key, mnemonic} from "../env.json";
import {Address, beginCell, Cell} from "ton-core";
import {SmartContract} from "ton-contract-executor";


async function createDao() {
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let address = Address.parse('EQAf4ZfpaDK7Sn8NKgUznjpoyUpkRVRkjA6OqT9LxV-NGNUm');
    let res = await client.getContractState(address)

    let code = Cell.fromBoc(res.code!)[0]
    let data = Cell.fromBoc(res.data!)[0]
    let contract = await SmartContract.fromCell(code, data);
    let dataRes = await contract.invokeGetMethod('getDaoInfo', [])

    if (dataRes.exit_code !== 0 || dataRes.type !== 'success') {
        return false
    }

    if (dataRes.result.length !== 5) {
        return false
    }
    let [creator, collectionId, collectionName, tgAccount, twitter] = dataRes.result as [Slice, Cell, Cell, Cell, Cell]
    console.log(creator.loadAddress().toString({urlSafe:true}));
    console.log(collectionId.asSlice().loadStringTail());
    console.log(collectionName.asSlice().loadStringTail());
    console.log(tgAccount.asSlice().loadStringTail());
    console.log(twitter.asSlice().loadStringTail());
}

createDao().then(() => process.exit(0)).catch(e => console.log(e))
