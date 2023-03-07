import {Address, toNano} from "ton-core";
import {TonClient, WalletContractV3R2} from "ton";
import {mnemonic, api_key} from "../env.json";
import {mnemonicToPrivateKey} from "ton-crypto";
import Collection from "./collection";


async function deploy() {
    let owner = Address.parse("kQCWsaU-piIXzA4MlbcRabYfWJXrjcq-9e9gnwB7pfSz8jdG");
    let contractAddr = Address.parse("EQBwWBdiFU8RireGGhd9BvMdCwj6m1EUFoogKeIwlZ0PQBrl");
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    let collection = new Collection(contractAddr);
    let collectionContract = await client.open(collection);
    let params = {
        passAmount: toNano('0.5'),
        itemIndex: 0,
        itemOwnerAddress: owner,
        itemContent: 'test_content'
    }
    await collectionContract.sendMintNFT(walletSender, params);
}

deploy().then(() => process.exit(0)).catch(e => console.log(e));
