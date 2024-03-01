import React, {useEffect, useMemo, useRef, useState} from "react";
import {initCanvasScene, showNft} from "./Objects";
import {
    checkStacksWallet,
    checkBnsDomain,
    stacksFetchCollections,
    stacksFetchNfts
} from "./Query";
import Collection, {CollectionType} from "./Collection";
import rootstockGalleryLogo from "../images/rootstock-gallery-logo.jpg";
import stacksGalleryLogo from "../images/stacks-gallery-logo.png";

export const CustomLoader = () => {
    return <div>
        <div className="lds-ring">
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    </div>
}

const GalleryStacks = () => {
    const canvasRef = useRef(null);
    const [nftSearchFinished, setNftSearchFinished] = useState<boolean>(false)
    const [nfts, setNfts] = useState<any[]>([])
    const [collectionsSearchFinished, setCollectionsSearchFinished] = useState<boolean>(false)
    const [collections, setCollections] = useState<CollectionType[]>([])
    const [gameActive, setGameActive] = useState(false)
    const [inputAddress, setInputAddress] = useState<string>('')
    const [inputAddressError, setInputAddressError] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [domain, setDomain] = useState<string>('')
    const [loading, setLoading] = useState<any>(0)
    const [loadingText, setLoadingText] = useState<string>('')

    const totalSelected: {
        selectedCollections: CollectionType[],
        totalNfts: number
    } = useMemo(() => {
        let sum: number = 0;
        const selectedCollections = collections?.filter(collection => {
            if (collection?.selected) sum += parseInt(collection?.count)
            return collection?.selected === true
        })
        return {
            selectedCollections: selectedCollections,
            totalNfts: sum
        }
    }, [collections])

    let engine: any = null
    let scene: any = null

    useEffect(() => {
        if((address || domain) && !inputAddressError) {
            setLoading(true)
            setLoadingText("Search NFT collections")
            stacksFetchCollections(setCollections, setCollectionsSearchFinished, address).then(() => {
                setLoading(false)
                setLoadingText("")
            })
        }
    }, [address, domain]);

    useEffect(() => {
        initCanvasScene(engine, scene, canvasRef, setGameActive)
    }, []);

    useEffect(() => {
        showNft(scene, nfts)
    }, [nfts]);

    const handlerDisconnect = () => {
        window.location.reload();
    }

    const handlerSearchByAddress = async (e: any, inputAddress: any) => {
        e.preventDefault();

        if (!inputAddress.trim()) {
            setInputAddressError('Please insert a Stacks address or a BNS name')
        } else if (inputAddress.trim().toUpperCase().substring(0, 1) !== "S"
            && !inputAddress.trim().includes(".")) {
            setInputAddressError('Invalid Stacks address or BNS name')
        } else {
            setLoading(true)

            if (inputAddress.trim().toUpperCase().substring(0, 1) === "S"){
                setLoadingText("Check Stacks address")
                let result = await checkStacksWallet(inputAddress.trim().toUpperCase(), setAddress, setLoading)
                if (result?.error){
                    setInputAddressError(result?.error)
                    setLoading(false)
                }
            }
            else {
                setLoadingText("Check BNS name");
                let result = await checkBnsDomain(inputAddress.trim(), setAddress, setDomain, setLoading)
                if (result?.error){
                    setInputAddressError(result?.error)
                    setLoading(false)
                }
            }
        }
    }

    return (
        <div style={{height: '100vh', overflow: 'hidden'}}>
            {
                gameActive &&
                <div className="info-div">
                    <div>
                        <b>Wallet: </b>
                        <a target="_blank" href={`https://gamma.io/${address}`}
                           style={{textDecoration: "none", color: "#000"}}>
                            <u>{`${address.slice(0, 10)}...${address.slice(-10)}`}</u>
                        </a>
                    </div>

                    {domain &&
                        <div>
                            <b>BNS name: </b>
                            <a target="_blank" href={`https://gamma.io/${domain}`} style={{textDecoration: "none", color: "#000"}}>
                                <u>{domain}</u>
                            </a>
                        </div>
                    }
                    <div><b>Selected NFT collections:</b> {totalSelected.selectedCollections.length}</div>
                    <div ><b>NFTs:</b> {totalSelected.totalNfts} / 40 [max]</div>
                </div>
            }

            {(!gameActive) &&
                <div className={`canvas-container`}>
                    <div className="center-div">
                        <div className="children-center-div">
                            <div className="gallery-type-info" >
                                <img src={stacksGalleryLogo} style={{width: "50px", marginBottom: "10px"}}/>
                                <h4><b>Stacks</b></h4>
                            </div>
                            <hr/>

                            {!collectionsSearchFinished && !loading && <>
                                <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <input onChange={(e: any) => {
                                        setInputAddressError('');
                                        setInputAddress(e.target.value)
                                    }}
                                           type="text"
                                           id="fname"
                                           placeholder='Stacks address or a BNS name'/>
                                    <button disabled={loading}
                                            style={{marginLeft: '5px'}}
                                            className={"button"}
                                            onClick={(e: any) => {
                                                handlerSearchByAddress(e, inputAddress)
                                            }}
                                    >
                                        Search
                                    </button>
                                </div>

                                {inputAddressError &&
                                    <div style={{color: 'red', fontWeight: '600'}}>
                                        {inputAddressError}
                                    </div>
                                }
                            </>
                            }

                            {
                                loading ?
                                    <>
                                        <CustomLoader/>
                                        <p>{loadingText}</p>
                                    </> : ""
                            }

                            {
                                !loading && collectionsSearchFinished  && !nftSearchFinished
                                && <div>

                                    {
                                        collections.length === 0
                                            ? <div className='fs-5'>
                                                <b>No collections found</b>
                                            </div>
                                            : <>
                                                <div className='fs-5'>
                                                    <b>Collections found:</b> {collections.length}
                                                </div>

                                                <div className='fs-6'>
                                                    <p>Click and select the collections you want to see.</p>
                                                </div>

                                                <div className={"collection-container"}>
                                                    <>
                                                        {
                                                            collections.map((collection:any, index) => {
                                                                return <Collection
                                                                    key={index}
                                                                    chain="stacks"
                                                                    collections={collections}
                                                                    setCollections={setCollections}
                                                                    collection={collection}
                                                                />
                                                            })
                                                        }
                                                    </>
                                                </div>

                                                <div  className='d-flex justify-content-between w-100'>
                                                    <div className='fs-8 text-start'><b>Collections selected: </b>
                                                        {totalSelected.selectedCollections.length}
                                                    </div>

                                                    <div className='fs-8 text-start'><b>NFTs selected: </b>
                                                        {totalSelected.totalNfts}
                                                    </div>
                                                </div>

                                                {
                                                    totalSelected.totalNfts > 40 &&
                                                    <div className={"disclaimer"}>
                                                        <b>Attention !</b> At the moment, the capacity of the gallery is only 40 NFTs.
                                                    </div>
                                                }
                                            </>
                                    }

                                    <div >
                                        <button className={"w-100 mt-2 button"}
                                                onClick={() => {
                                                    setLoading(true)
                                                    setLoadingText(`Fetching NFTs data: 0 / ${totalSelected.totalNfts}`)
                                                    stacksFetchNfts(totalSelected.selectedCollections, totalSelected.totalNfts, setLoadingText, address, setNfts, setNftSearchFinished).then(() => {
                                                        setGameActive(true)
                                                        setLoading(false)
                                                        setLoadingText("")
                                                    })
                                                }}
                                        >
                                            {
                                                collections.length ? "Fetch NFTs data" : "Join gallery"
                                            }
                                        </button>
                                    </div>

                                </div>
                            }

                            {
                                nftSearchFinished
                                && <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <button className={"button"}
                                            onClick={() => {
                                                setGameActive(true)
                                            }}
                                    >
                                        Resume
                                    </button>
                                    <button className={"button"}
                                            style={{width: '250px', marginLeft: '75px'}}
                                            onClick={handlerDisconnect}>
                                        Try new address
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

            <canvas ref={canvasRef} />
        </div>
    );
};

export default GalleryStacks;