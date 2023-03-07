import {TonClient, WalletContractV3R2} from "ton";
import {api_key, mnemonic} from "../env.json";
import {mnemonicToPrivateKey} from "ton-crypto";
import TonWeb from "tonweb";
import Collection from "./collection";
import {Address} from "ton-core";

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
    const collection = new Collection(Address.parse(nftCollectionAddress.toString()))
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    const mintBody = await tonWebCollection.createMintBody({
        amount: TonWeb.utils.toNano("0.05"),
        itemContentUri: "https://testnet.toncenter.com/",
        itemIndex: 1,
        itemOwnerAddress: ownerAddr
    })
    const walletSender = walletContract.sender(key.secretKey);
    let collectionContract = await client.open(collection);
    await collectionContract.sendMintNFT(walletSender, await mintBody.toBoc());
}

deploy().then(() => process.exit(0)).catch(e => console.log(e));
