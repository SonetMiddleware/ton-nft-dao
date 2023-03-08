import {BitString, toNano, TonClient, WalletContractV3R2} from "ton";
import {api_key, mnemonic} from "../env.json";
import {mnemonicToPrivateKey} from "ton-crypto";
import {Address, beginCell, Cell} from "ton-core";
import TonWeb from "tonweb";

async function deploy() {
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    let resp = {
        value: "0.08",
        payload: "te6cckEBAwEARAABMQAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgBAUOAEtY0p9TEQvmBwZK24i02w+sSvXG5V9697BPgD3S+ln5QAgACMOYxvl8="
    }
    let body = Cell.fromBase64(resp.payload);
    let collectionAddress = Address.parse("UQDdvpuLE5sCxmVvj72HVVZTuEin7IIi6YuQ1URhTb0RzOU2");
    await walletContract.sendTransfer({
        seqno: await walletContract.getSeqno(),
        secretKey: key.secretKey,
        messages: [{
            info: {
                type: 'internal',
                ihrDisabled: false,
                bounce: false,
                bounced: false,
                dest: collectionAddress,
                value: {coins: toNano(resp.value)},
                ihrFee: toNano(0),
                forwardFee: toNano(0),
                createdLt: toNano(0),
                createdAt: 0
            },
            body: body
        }]
    });
}

deploy().then(() => process.exit(0)).catch(e => console.log(e));
