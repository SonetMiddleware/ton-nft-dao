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
        to: "UQBbsndbKyh2P7fHDdwya5SLmZEHoQRR9NrmwxynC5nx8HJH",
        state_init: "te6cckECJwEABQcAAgE0ARUBFP8A9KQT9LzyyAsCAgFiAw4CAs0ECQTn0QY4BIrfAA6GmBgLjYSK3wfSAYAOmP6Z/2omh9IGmf6mpqGEEINJ6cqClAXUcUG6+CgOhBCFRlgFa4QAhkZYKoAueLEn0BCmW1CeWP5Z+A54tkwCB9gHAbKLnjgvlwyJLgAPGBEuABcYES4AHxgRgZgeACQFBgcIAGA1AtM/UxO78uGSUxO6AfoA1DAoEDRZ8AaOEgGkQ0PIUAXPFhPLP8zMzMntVJJfBeIApjVwA9QwjjeAQPSWb6UgjikGpCCBAPq+k/LBj96BAZMhoFMlu/L0AvoA1DAiVEsw8AYjupMCpALeBJJsIeKz5jAyUERDE8hQBc8WE8s/zMzMye1UACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UADyOFdTUMBA0QTDIUAXPFhPLP8zMzMntVOBfBIQP8vACASAKDQIBIAsMAC0AcjLP/gozxbJcCDIywET9AD0AMsAyYAAbPkAdMjLAhLKB8v/ydCAAPUWvAEcCHwBXeAGMjLBVjPFlAE+gITy2sSzMzJcfsAgCASAPFAIBIBARAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgEgEhMAL7Xa/aiaH0gaZ/qamoYNiDoaYfph/0gGEAAttPR9qJofSBpn+pqahgKL4J4AjgA+ALAAJbyC32omh9IGmf6mpqGC3oahgsQDU4AS1jSn1MRC+YHBkrbiLTbD6xK9cblX3r3sE+APdL6WfkAAAAAAAAAAEBYZJgIAFxgAtAFodHRwczovL2FwaXYyLXRlc3QucGxhdHdpbi5pby9hc3NldHMvdG9uLWNvbGxlY3Rpb24vVE9OdGVzdC9Tb1RvbiUyMFRlc3QlMjBDb2xsZWN0aW9uJTIwMwC0aHR0cHM6Ly9hcGl2Mi10ZXN0LnBsYXR3aW4uaW8vYXNzZXRzL3Rvbi1jb2xsZWN0aW9uL1RPTnRlc3QvU29Ub24lMjBUZXN0JTIwQ29sbGVjdGlvbiUyMDMvART/APSkE/S88sgLGgIBYhslAgLOHCICASAdIQLXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgHiAB9lE1xwXy4ZH6QCHwAfpA0gAx+gCCCvrwgBuhIZRTFaCh3iLXCwHDACCSBqGRNuIgwv/y4ZIhjj6CEAUTjZHIUAnPFlALzxZxJEkUVEagcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAQR5QQKjdb4h8AggKONSbwAYIQ1TJ22xA3RABtcXCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAkzAyNOJVAvADAHJwghCLdxc1BcjL/1AEzxYQJIBAcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAAET6RDBwuvLhTYAIBICMkADs7UTQ0z/6QCDXScIAmn8B+kDUMBAkECPgMHBZbW2AAHQDyMs/WM8WAc8WzMntVIAAJoR+f4AUASwAyA+iAEtY0p9TEQvmBwZK24i02w+sSvXG5V9697BPgD3S+ln5QGTy+CQ=="
    }
    let cell = Cell.fromBase64(resp.state_init).beginParse();
    cell.loadBits(5)
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
