import React, {useEffect, useState} from "react";
import '../home.css';
import background from '../images/back.png';
import btcHackathonLogo from '../images/btc_hack_logo.png';
import stacksGalleryLogo from '../images/stacks-gallery-logo.png';
import rootstockGalleryLogo from '../images/rootstock-gallery-logo.jpg';
import btcOrdinalsGalleryLogo1 from '../images/btc-ordinal-logo1.png';
import btcOrdinalsGalleryLogo2 from '../images/btc-ordinal-logo2.png';


export const Home = (): JSX.Element => {
    const imgExtensions = ["png", "png", "png", "png", "jpg", "png", "png"]
    const [imageIndex, setImageIndex] = useState(1)
    useEffect(()=>{
        const a = setInterval( ()=>{
            setImageIndex(prev => prev % 7 + 1)
        }, 1000)
        return () => clearInterval(a)
    }, [])

    return <>
        <main style={{backgroundImage:`url(${background})` }}>
            <div className="wrapper">
                <div className="content">
                    <div className="flex">
                        <div className="left">
                            <h2>Bitcoin Gallery 🎨</h2>
                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A 3D in-browser gallery that allows users to look at their Bitcoin Ordinals or NFTs on Rootstock & Stacks in a new, interactive and entertaining way.
                            </p>
                        </div>

                        <div className="right">
                            <img src={require(`../collections/${imageIndex}.${imgExtensions[imageIndex - 1]}`)}></img>
                        </div>
                    </div>
                </div>

                <div style={{margin: "15px auto", textAlign: "center"}}>
                    <h2><b>Gallery types:</b><br/></h2>
                </div>

                <div className="row-content">
                    <div className="content" style={{width: "49%"}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "15px auto", textAlign: "center"}}>
                            <img src={stacksGalleryLogo} style={{width: "100px", marginBottom: "10px"}}/>
                            <h3><b>Stacks</b></h3>
                            <a href="/gallery-stacks">
                                <button className="button mt-3">Go to gallery</button>
                            </a>
                        </div>
                    </div>

                    <div className="content" style={{width: "49%"}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "15px auto", textAlign: "center"}}>
                            <div style={{width: "60%", display: "flex", justifyContent: "space-around"}}>
                                <img src={btcOrdinalsGalleryLogo1} style={{width: "100px", marginBottom: "10px"}}/>
                                <img src={btcOrdinalsGalleryLogo2} style={{width: "100px", marginBottom: "10px"}}/>
                            </div>
                            <h3><b>Bitcoin Ordinals</b></h3>
                            <a href="/gallery-ordinals">
                                <button className="button mt-3">Go to gallery</button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "15px auto", textAlign: "center"}}>
                        <img src={rootstockGalleryLogo} style={{borderRadius: "50%", width: "100px", marginBottom: "10px"}}/>
                        <h3><b>Rootstock</b></h3>

                        <div className="warning-rsk">
                            <b>Attention !</b> Since we did not find collections as such on Rootstock Mainnet, we created a fun NFT collection without utility (in the testnet) to show the functionality of the gallery. You can mint for free (you need to pay a fee on the test network). Faucet RSK:
                            &nbsp;<a href="https://faucet.rsk.co/" target="_blank">Link</a>
                        </div>

                        <div>
                            <a href="https://mint-rootstockpixels.netlify.app/" target="_blank" style={{margin: "0px 20px"}}>
                                <button className="button mt-3">Mint free NFT</button>
                            </a>
                            <a href="/gallery-rootstock" style={{margin: "0px 20px"}}>
                                <button className="button mt-3">Go to gallery</button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="content">
                    <center>
                        <h5>Project created for<br/>
                            <b>"Bitcoin Olympics Hackathon"</b>
                        </h5>
                        <div style={{marginTop: "20px", width: "90%", display: "flex", justifyContent: "space-between"}}>
                            <a href="https://btcolympics.devpost.com/" target="_blank">
                                <img src={btcHackathonLogo} />
                            </a>
                        </div>
                    </center>
                </div>

                <div className="content">
                    <h1>Future plans / To do:</h1>
                    <br/>

                    <div className="roadmap">

                        <div className="article">
                            <div className="status">
                                <span className="loader"></span>
                            </div>
                            <div className="title">
                                Find & add new NFT collections from Rootstock Mainnet;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Increase the capacity of the 3D gallery;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Add multiplayer feature;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Integration of Metamask, Hiro and other wallets;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Ability to save the state of the gallery and share the link;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Add background music;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                Improve UI/UX design;
                            </div>
                        </div>

                        <div className="article">
                            <div className="status"><span className="loader"></span></div>
                            <div className="title">
                                and other features;
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </>
}

export default Home
