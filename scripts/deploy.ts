import {TonClient, WalletContractV3R2} from "ton";
import {api_key, mnemonic} from "../env.json";
import {mnemonicToPrivateKey} from "ton-crypto";
import TonWeb from "tonweb";
import Collection from "./collection";
import {Address, Cell} from "ton-core";

const {NftItem, NftCollection} = TonWeb.token.nft

async function deploy() {
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let ownerAddr = new TonWeb.Address("kQCWsaU-piIXzA4MlbcRabYfWJXrjcq-9e9gnwB7pfSz8jdG")
    const createCollectionParams = {
        ownerAddress: ownerAddr,
        royalty: 0,
        royaltyAddress: ownerAddr,
        collectionContentUri: "https://testnet.toncenter.com/",
        nftItemContentBaseUri: "https://testnet.toncenter.com/",
        nftItemCodeHex: NftItem.codeHex,
    }
    const tonWebProvider = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: api_key});
    let tonWebCollection = new NftCollection(tonWebProvider, createCollectionParams);
    const nftCollectionAddress = await tonWebCollection.getAddress()
    console.log(nftCollectionAddress.toString(true,true));
    const stateInit = await tonWebCollection.createStateInit();
    const collection = new Collection(Address.parse(nftCollectionAddress.toString()), {
        code: Cell.fromBoc(Buffer.from(await stateInit.code.toBoc()))[0],
        data: Cell.fromBoc(Buffer.from(await stateInit.data.toBoc()))[0]
    })
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    let collectionContract = await client.open(collection);
    await collectionContract.sendDeploy(walletSender);
}

deploy().then(() => process.exit(0)).catch(e => console.log(e));
