import {toNano, TonClient, WalletContractV3R2} from "ton";
import {api_key, mnemonic} from "../env.json";
import {mnemonicToPrivateKey} from "ton-crypto";
import {Address, Cell} from "ton-core";

async function deploy() {
    let client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', apiKey: api_key,
    })
    let key = await mnemonicToPrivateKey(mnemonic.split(" "));
    let wallet = await WalletContractV3R2.create({workchain: 0, publicKey: key.publicKey})
    let walletContract = await client.open(wallet);
    let resp = {
        value: "0.1",
        to: "UQDdvpuLE5sCxmVvj72HVVZTuEin7IIi6YuQ1URhTb0RzOU2",
        state_init: "te6cckECJwEABN0AAgATAQNTgBLWNKfUxEL5gcGStuItNsPrEr1xuVfevewT4A90vpZ+QAAAAAAAAAAQEAMCAEsAMgPogBLWNKfUxEL5gcGStuItNsPrEr1xuVfevewT4A90vpZ+UAEU/wD0pBP0vPLICwQCAWIGBQAJoR+f4AUCAs4KBwIBIAkIAB0A8jLP1jPFgHPFszJ7VSAAOztRNDTP/pAINdJwgCafwH6QNQwECQQI+AwcFltbYAIBIAwLABE+kQwcLry4U2AC1wyIccAkl8D4NDTAwFxsJJfA+D6QPpAMfoAMXHXIfoAMfoAMPACBLOOFDBsIjRSMscF8uGVAfpA1DAQI/AD4AbTH9M/ghBfzD0UUjC6jocyEDdeMkAT4DA0NDU1ghAvyyaiErrjAl8EhA/y8IA4NAHJwghCLdxc1BcjL/1AEzxYQJIBAcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAB9lE1xwXy4ZH6QCHwAfpA0gAx+gCCCvrwgBuhIZRTFaCh3iLXCwHDACCSBqGRNuIgwv/y4ZIhjj6CEAUTjZHIUAnPFlALzxZxJEkUVEagcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAQR5QQKjdb4g8AggKONSbwAYIQ1TJ22xA3RABtcXCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAkzAyNOJVAvADAgASEQB6aHR0cHM6Ly9hcGl2Mi10ZXN0LnBsYXR3aW4uaW8vYXNzZXRzL3Rvbi1jb2xsZWN0aW9uLy9UT050ZXN0LwCcAWh0dHBzOi8vYXBpdjItdGVzdC5wbGF0d2luLmlvL2Fzc2V0cy90b24tY29sbGVjdGlvbi8vVE9OdGVzdC9vdXQlMjB0aGUlMjBkb29yART/APSkE/S88sgLFAIBYhwVAgEgFxYAJbyC32omh9IGmf6mpqGC3oahgsQCASAbGAIBIBoZAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNIh0CASAfHgA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBICEgABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkJiUkIwA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiuTEcXQ=="
    }
    let cell = Cell.fromBase64(resp.state_init).beginParse();
    let codeCell = cell.loadRef();
    let dataCell = cell.loadRef();
    let collectionAddress = Address.parse(resp.to);
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
            init: {code: codeCell, data: dataCell},
            body: new Cell()
        }]
    });
}

deploy().then(() => process.exit(0)).catch(e => console.log(e));
