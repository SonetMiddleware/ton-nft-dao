import {mnemonicToPrivateKey} from "ton-crypto";
import {api_key, mnemonic} from "../env.json";
import {beginCell, safeSign, safeSignVerify} from "ton-core";
import {WalletContractV3R2, WalletContractV4} from "ton";

async function signAndVerify() {
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let data = beginCell().storeStringTail("aaa").endCell();
    const sig = safeSign(data, key.secretKey);
    console.log(sig.toString('base64'));
    console.log(key.publicKey.toString('hex'));
    const verified = safeSignVerify(data, sig, key.publicKey)
    console.log(verified);

    WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    WalletContractV4.create({workchain: 0, publicKey: key.publicKey})
}

signAndVerify().then()
