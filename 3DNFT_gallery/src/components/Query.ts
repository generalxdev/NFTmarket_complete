import {rootstockRpc, RSK_WHITELISTED_COLLECTIONS, NFT_CONTRACT_ABI, sleep, withTimeout, hexToString} from './Utils';
import noImage from '../images/noImage.png';
const ethers = require('ethers')
const { Buffer } = require('buffer');

window.Buffer = window.Buffer || Buffer;

const MAX_CAPACITY = 40
const rootstockProviderEthers = new ethers.providers.JsonRpcProvider(rootstockRpc);

export const checkStacksWallet = async (address: any, setAddress: any, setLoading: any) => {
    let result;
    try {
        const url = `https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`
        const response = await fetch(url)
        const data = await response.json();

        if(data?.error){
            result = {
                "error" : "Error when check Stacks address"
            }
            if(data?.error.substring(0, 19) === "invalid STX address"){
                result = {
                    "error" : "Invalid Stacks address"
                }
            }
        }
    } catch (err) {
        console.log(err)
        result =  {
            "error" : "Error when check Stacks address"
        }
    }
    setAddress(address)
    return result
}


export const checkBnsDomain = async (bnsDomain: any, setAddress: any, setDomain: any, setLoading: any) => {
    let result;
    try {
        const url = `https://api.bns.xyz/v1/names/${bnsDomain}`
        const response = await fetch(url)
        const data = await response.json();

        if(data?.error){
            result = {
                "error" : "Error when check BNS name"
            }
            if(data?.error?.message.substring(0, 27) === "Unable to fetch details for"){
                result = {
                    "error" : data?.error?.message
                }
            }
        }
        else if(data?.address) {
            setAddress(data?.address.split(".")[0])
            setDomain(bnsDomain)
        }
        else {
            result = {
                "error" : "Error when check BNS name"
            }
        }
    } catch (err) {
        console.log(err)
        result =  {
            "error" : "Error when check Stacks address"
        }
    }
    setLoading(false)
    return result
}



export const stacksFetchCollections = async (setCollections: any, setCollectionsSearchFinished: any, address: any) => {
    try {
        const collectionsData: any = []
        const limit = 200
        let offset = 0

        do {
            let url = `https://api.mainnet.hiro.so/extended/v1/tokens/nft/holdings?limit=${limit}&offset=${offset}&principal=${address}`
            const response = await fetch(url)
            const data = await response.json();

            if( data?.results?.length === 0){
                break
            }
            else {
                data?.results.map( async (asset: any) => {
                    if(!asset?.value?.repr){
                        console.log("Inexistent token ID")
                    }
                    let tokenId = asset?.value?.repr.replace("u", "")
                    if (asset?.asset_identifier === "SP000000000000000000002Q6VF78.bns::names") {
                        let bnsName = hexToString(asset?.value?.repr.split("(tuple (name 0x")[1].split(") (namespace")[0])
                        try {
                            const endpoint = `https://api.bns.xyz/bns/addresses/stacks/${address}`
                            const response = await fetch(endpoint);
                            const result = await response.json()
                            tokenId = result?.names[0]
                            for (let i = 0; i < result?.names.length; i++) {
                                if (result?.names[i].split(".")[0] === bnsName){
                                    tokenId = result?.names[i];
                                    break
                                }
                            }
                        } catch (err) {
                            tokenId = "name"
                        }
                    }

                    let exists = false
                    for (let i = 0; i < collectionsData.length; i++){
                        if(collectionsData[i].contract === asset?.asset_identifier) {
                            exists = true
                            if(!collectionsData[i].tokensData[tokenId]){
                                collectionsData[i].count++
                                collectionsData[i].tokensData[tokenId] = {}
                            }
                            break
                        }
                    }
                    if(!exists){
                        let obj: any = {};
                        obj[tokenId] = {};

                        collectionsData.push({
                            "collectionName" : "unknown collection",
                            "chain" : "stacks",
                            "selected" : false,
                            "contract" : asset?.asset_identifier,
                            "count" : 1,
                            "tokensData" : obj
                        })
                    }
                })

                if (data?.results?.length === limit){
                    offset += limit
                } else {
                    break
                }
            }
        } while (1)
        setCollections(collectionsData)
    } catch (err) {
        console.log(err)
    }
    setCollectionsSearchFinished(true)
    return
}




export const stacksFetchNfts = async (collectionsData: any, nftSelectedCount: any, setLoadingText: any, address: any, setNfts: any, setNftSearchFinished: any) => {
    try {
        const nftArray : any = []
        for (let i = 0; i < collectionsData.length; i++) {
            if (nftArray.length >= MAX_CAPACITY){
                break
            }
            let {contract} = collectionsData[i];
            contract = contract.split("::")[0]
            const tokensIds = Object.keys(collectionsData[i].tokensData)

            const promisesMetadataArray = [];
            for (let j = 0; j < tokensIds.length; j++) {
                try {
                    let url = `https://gql.stxnft.com/`;
                    let fetchPromise = fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `query fetchNftTokens($where: nft_tokens_bool_exp = {}) {\n  nft_tokens(where: $where) {\n    asset_id\n    collection_contract_id\n    token_id\n    fully_qualified_token_id\n    nft_token_metadata {\n      fully_qualified_token_id\n      image_url\n      image_type\n      image_protocol\n      asset_url\n      asset_type\n      asset_protocol\n      asset_id\n      name\n      contract_id\n      description\n    }\n    nft_token_attributes {\n      value\n      trait_type\n    }\n    marketplace_list_events_active {\n      fully_qualified_token_id\n      commission_trait\n      burn_block_time_iso\n      block_height\n      price_amount\n      royalty_percent\n      price_currency\n      sender_address\n      tx_id\n      marketplace_contract\n      fees\n    }\n    nft_collection_metadata {\n      contract_id\n      collection_level\n      name\n    }\n  }\n}`,
                            variables: {"where":{"collection_contract_id":{"_in":[contract]},"token_id":{"_eq":tokensIds[j]}}},
                        }),
                    })
                    promisesMetadataArray.push(fetchPromise);
                } catch (err) {
                    console.log("error tokenURI")
                }
            }

            let metadataArray: any = await Promise.allSettled(promisesMetadataArray);
            for (let j = 0; j < metadataArray.length; j++) {
                try {
                    if (metadataArray[j].status === "fulfilled") {
                        if (nftArray.length >= MAX_CAPACITY){
                            break
                        }
                        setLoadingText(`Fetching NFTs data: ${nftArray.length} / ${nftSelectedCount}`)

                        if (collectionsData[i].contract === "SP000000000000000000002Q6VF78.bns::names") {
                            const name = `BNS: ${tokensIds[j]}`
                            nftArray.push({
                                "name" : name,
                                "image" : "https://images.gamma.io/ipfs/QmexxomSWKaguguGLz4JFE6EgncSi5CwxvPhR9vxpEwXLn"
                            })
                            continue
                        }

                        let result = await metadataArray[j].value.json()
                        let data = result?.data?.nft_tokens[0]?.nft_token_metadata

                        const name = data?.name || `${collectionsData[i].collectionName} #${tokensIds[j]}`
                        let image = noImage
                        if (data?.image_url) {
                            image = data?.image_url
                                .replace("ipfs://", "https://hbd.infura-ipfs.io/ipfs/")
                                .replace("https://ipfs.io/ipfs/", "https://hbd.infura-ipfs.io/ipfs/")
                                .replace("https://gateway.pinata.cloud/ipfs/", "https://nftstorage.link/ipfs/")
                        }

                        nftArray.push({
                            "name" : name,
                            "image" : image
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
        setNfts(nftArray.slice(0, 40))
    } catch (err) {
        console.log(err)
    }
    setNftSearchFinished(true)
    return
}


export const rootstockFetchCollections = async (setCollections: any, setCollectionsSearchFinished: any, inputAddress: any) => {
    try {
        const collectionsData: any = []
        const balanceOfPromises: any = [];
        for (let i = 0; i < RSK_WHITELISTED_COLLECTIONS.length; i++) {
            const {contract: contractAddress} = RSK_WHITELISTED_COLLECTIONS[i]
            const contractInstance = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, rootstockProviderEthers);
            balanceOfPromises.push(
                contractInstance.balanceOf(inputAddress)
            );
        }

        let tempBalance: any = await Promise.allSettled(balanceOfPromises);
        for (let i = 0; i < tempBalance.length; i++) {
            try {
                const {contract: contractAddress, name, symbol} = RSK_WHITELISTED_COLLECTIONS[i]
                if (tempBalance[i].status === "fulfilled") {
                    let nftCount = tempBalance[i].value.toString();
                    if (nftCount >= 1) {
                        collectionsData.push({
                            "selected" : false,
                            "contract" : contractAddress,
                            "name" : name,
                            "symbol" : symbol,
                            "count" : nftCount,
                            "tokensData" : {}
                        })
                    }
                }
            } catch (err){
                console.log(err)
            }
        }
        setCollections(collectionsData)
    } catch (err) {
        console.log(err)
    }
    setCollectionsSearchFinished(true)
    return
}

export const rootstockFetchNfts = async (collectionsData: any, nftSelecteCount: any, setLoadingText: any, address: any, setNfts: any, setNftSearchFinished: any) => {
    try {
        let tokensFound = 0;
        let totalNftsFetched = 0

        for (let i = 0; i < collectionsData.length; i++) {
            if (tokensFound >= MAX_CAPACITY) {
                break
            }
            const {contract, count, symbol} = collectionsData[i];
            const contractInstance = new ethers.Contract(contract, NFT_CONTRACT_ABI, rootstockProviderEthers);

            let tokensIndexes = [];
            for (let j = 0; j < count; j++){
                try {
                    if (tokensFound < MAX_CAPACITY){
                        tokensIndexes.push(j);
                        tokensFound++
                    }
                } catch (err){
                    console.log("error tokenOfOwnerByIndex")
                }
            }

            do {
                let success = 0
                const promisesIds = []
                for (let j = 0; j < tokensIndexes.length; j++){
                    try {
                        promisesIds.push(
                            contractInstance.tokenOfOwnerByIndex(address, tokensIndexes[j])
                        );
                    } catch (err){
                        console.log("error tokenOfOwnerByIndex")
                    }
                }
                let tempTokensIndexes:any = []
                let idArray: any = await Promise.allSettled(promisesIds);
                for (let j = 0; j < idArray.length; j++) {
                    try {
                        if (idArray[j].status === "rejected") {
                            tempTokensIndexes.push(tokensIndexes[j])
                        }
                        if (idArray[j].status === "fulfilled") {
                            success++
                            totalNftsFetched++
                            const tokenId = idArray[j].value.toString()

                            let uri = null;
                            collectionsData[i].tokensData[tokenId] = {
                                "uri" : uri,
                                "image" : null,
                                "name" : `${symbol} #${tokenId}`,
                            }
                        }
                    } catch (err){
                        console.log(err)
                    }
                }
                setLoadingText(`Fetching NFTs data: ${totalNftsFetched} / ${nftSelecteCount}`)
                tokensIndexes = tempTokensIndexes
                if(tokensIndexes.length === 0) break
                await sleep(5 * 1000)
            } while (tokensIndexes.length)
        }

        for (let i = 0; i < collectionsData.length; i++) {
            const {contract} = collectionsData[i];
            const contractInstance = new ethers.Contract(contract, NFT_CONTRACT_ABI, rootstockProviderEthers);
            const tokensIds = Object.keys(collectionsData[i].tokensData)
            const promisesUriArray = [];


            for (let j = 0; j < tokensIds.length; j++) {
                try {
                    promisesUriArray.push(
                        contractInstance.tokenURI(tokensIds[j])
                    );
                } catch (err) {
                    console.log("error tokenURI")
                }
            }

            let uriArray: any = await Promise.allSettled(promisesUriArray);
            for (let j = 0; j < uriArray.length; j++) {
                try {
                    if (uriArray[j].status === "fulfilled") {
                        const uri = (uriArray[j].value.includes("data:application/json;base64") ? "" : "https://corsproxy.xyz/") + uriArray[j].value
                            .replace("ipfs://", "https://hbd.infura-ipfs.io/ipfs/")
                            .replace("https://ipfs.io/ipfs/", "https://hbd.infura-ipfs.io/ipfs/")
                            .replace("https://gateway.pinata.cloud/ipfs/", "https://nftstorage.link/ipfs/")
                        collectionsData[i].tokensData[tokensIds[j]].uri = uri
                    }
                } catch (err) {
                    console.log(err)
                }
            }

        }

        const nftArray : any = []
        for (let i = 0; i < collectionsData.length; i++) {
            const tokensIds = Object.keys(collectionsData[i].tokensData)
            const tokensUris = []

            const promisesUriMetadataArray = [];
            for (let j = 0; j < tokensIds.length; j++){
                tokensUris.push(collectionsData[i]?.tokensData[tokensIds[j]]?.uri)
                promisesUriMetadataArray.push(
                    withTimeout(10000, fetch(collectionsData[i]?.tokensData[tokensIds[j]]?.uri))
                )
            }

            let uriMetadataArray: any = await Promise.allSettled(promisesUriMetadataArray);
            for (let j = 0; j < uriMetadataArray.length; j++) {
                try {
                    if (uriMetadataArray[j].status === "fulfilled") {
                        const result = await uriMetadataArray[j].value.json()
                        const data = result

                        if (data?.name && data?.name.substring(0, 1) !== "#"){
                            collectionsData[i].tokensData[tokensIds[j]].name = data.name
                        }
                        if (data?.image){
                            const image = (data.image.includes("data:image") ? "" : "https://corsproxy.xyz/") +  data.image
                                .replace("ipfs://", "https://hbd.infura-ipfs.io/ipfs/")
                                .replace("https://ipfs.io/ipfs/", "https://hbd.infura-ipfs.io/ipfs/")
                                .replace("https://gateway.pinata.cloud/ipfs/", "https://nftstorage.link/ipfs/")
                            collectionsData[i].tokensData[tokensIds[j]].image = image
                        }
                        nftArray.push({
                            "name" : collectionsData[i].tokensData[tokensIds[j]].name,
                            "image" : collectionsData[i].tokensData[tokensIds[j]].image
                        })
                    }
                } catch (err){
                    console.log(err)
                }
            }
        }
        setNfts(nftArray.slice(0, 40))
    } catch (err) {
        console.log(err)
    }
    setNftSearchFinished(true)
    return
}

export const ordinalsSearch = async (setOrdinals: any, setImageOrdinals: any, setOrdinalsSearchFinished: any, address: any) => {
    try {
        let url = `https://corsproxy.xyz/https://api-mainnet.magiceden.io/v2/ord/btc/wallets/tokens?limit=1000000&offset=0&ownerAddress=${address}`
        let response = await fetch(url)
        let result = await response.json()

        const imageOrdinals: any = []
        result?.tokens.map((ordinal: any) => {
            if (ordinal.contentType === "image/png" ||
                ordinal.contentType === "image/jpeg" ||
                ordinal.contentType === "image/webp" ||
                ordinal.contentType === "image/gif") {
                imageOrdinals.push({
                    "id" : ordinal.id,
                    "name" : ordinal?.inscriptionNumber,
                    "image" : null
                })
            }
        })
        setOrdinals(result.tokens)
        setImageOrdinals(imageOrdinals)
    } catch (err) {
        console.log(err)
    }
    setOrdinalsSearchFinished(true)
    return
}



export const ordinalsFetchData = async (imageOrdinals: any, setImageOrdinals: any, setOrdinalsFetchDataFinished: any) => {
    const newImageOrdinalsArray = []

    try {
        let totalNftsFetched = 0
        const promises = []

        for (let i = 0; i < imageOrdinals.length; i++) {
            if (i >= 2 * MAX_CAPACITY) {
                break
            }
            let url = `https://api.hiro.so/ordinals/v1/inscriptions/${imageOrdinals[i]?.id}/content`
            promises.push(fetch(url))
        }

        let promisesResponses: any = await Promise.allSettled(promises);
        for (let j = 0; j < promisesResponses.length; j++) {
            try {
                if (promisesResponses[j].status === "fulfilled"
                    && promisesResponses[j].value.status === 200
                ) {
                    if (totalNftsFetched < MAX_CAPACITY) {
                        totalNftsFetched++
                        newImageOrdinalsArray.push({
                            "image" : `https://api.hiro.so/ordinals/v1/inscriptions/${imageOrdinals[j].id}/content`,
                            "name" : `Ordinal #${imageOrdinals[j].name}`
                        })
                    }
                }
            } catch (err){
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }
    setImageOrdinals(newImageOrdinalsArray)
    setOrdinalsFetchDataFinished(true)
    return
}
