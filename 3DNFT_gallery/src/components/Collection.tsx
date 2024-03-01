import React from "react";
import '../index.css';


export type CollectionType = {
    contract: string
    count: string
    name: string
    selected: boolean
    symbol: symbol
    tokensData: any
}

export const Collection = ({
    chain,
    collection,
    setCollections,
    collections,
}: { chain: any, collection: any, setCollections: any, collections: any }): JSX.Element => {

    const toggleClass = () => {
        setCollections(collections?.map((item: any) => {
            return item?.contract === collection?.contract ? {
                ...item,
                selected: !collection?.selected
            } : item
        }))
    }

    return <>
        <div className={`collection ${collection?.selected ? 'selected' : ''}`} key={collection.contract}
             onClick={toggleClass}>
            <div className={"title"}>
                {
                    chain === "stacks" &&
                    <a target="_blank" href={"https://gamma.io/collections/" + collection.contract.split("::")[0]}>
                        <>
                            <b>{collection.contract.split("::")[1]}</b>
                        </>
                    </a>
                }

                {
                    chain === "rootstock" &&
                    <a target="_blank" href={"https://explorer.testnet.rsk.co/address/" + collection.contract.split("::")[0]}>
                        <>
                            <b>{collection.name}</b> [{collection.symbol}]
                        </>
                    </a>
                }
            </div>
            <div>
                <b>NFTs count: </b>{collection.count}
            </div>
        </div>
    </>
}

export default Collection
