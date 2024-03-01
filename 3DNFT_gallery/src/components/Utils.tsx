const rootstockRpc = "https://public-node.testnet.rsk.co";

const RSK_WHITELISTED_COLLECTIONS = [
    {
        "contract": "0xb7d4A56BA9c16406EE41D5a79af67A264F7934af",
        "name": "RootstockPixels",
        "symbol": "RootstockPixels",
    }
]

const NFT_CONTRACT_ABI = [
    {"outputs":[{"type":"uint256"}],"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","stateMutability":"view","type":"function"},
    {"outputs":[{"type":"string"}],"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"tokenURI","stateMutability":"view","type":"function"},
    {"outputs":[{"name":"_tokenId","type":"uint256"}],"inputs":[{"name":"_owner","type":"address"},{"name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","stateMutability":"view","type":"function"},
];

const hexToString =  (hexInit: any) => {
    var hex = hexInit.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const sleep = (ms: any) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


const withTimeout = (millis:any, promise:any) => {
    const timeout = new Promise((resolve, reject) =>
        setTimeout(() => {
            console.log(`Timed out after ${millis} ms.`)
            reject(`Timed out after ${millis} ms.`)
        }, millis)
    );
    return Promise.race([
        promise,
        timeout
    ]);
};

export {
    rootstockRpc,
    RSK_WHITELISTED_COLLECTIONS,
    NFT_CONTRACT_ABI,
    hexToString,
    sleep,
    withTimeout
};