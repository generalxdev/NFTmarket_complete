import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useWallet } from "src/lib/hooks/wallet";

// Material
import {
    alpha,
    Avatar,
    Badge,
    Button,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Popover,
    Stack,
    Typography
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';

export default function Wallet() {
    const { account, active, library, chainId } = useWeb3React();

    const anchorRef = useRef(null);

    const [open, setOpen] = useState(false);

    let logoImageUrl = null;


    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        setOpen(false);
        disconnect();
    }

    const [show, setShow] = useState(false);
    const [isMetamaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const handleClose1 = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const isMetaMaskInstalled = () => {
          const { ethereum } = window;
          if (!ethereum) {
            setIsMetaMaskInstalled(false);
          } else {
            setIsMetaMaskInstalled(true);
          }
        };
        isMetaMaskInstalled();
      }, []);
    
      const { connectWallet, disconnectWallet } = useWallet();

    async function connect(m) {
        await connectWallet(m);
        setShow(false);
    }
    async function disconnect() {
        await disconnectWallet();
    }

    function loadMetamaskbutton() {
        if (!isMetamaskInstalled) {
            return (
            <a
                target="blank"
                className="btn btn-clear"
                href="https://metamask.io/download"
            >
                <img src="/mbtn.png" alt="metamask button" width="40" /> Metamask
            </a>
            );
        } else {
            return (
            <button
                className="btn btn-clear"
                onClick={() => {
                console.log("Login");
                connect(0);
                }}
            >
                <img src="/mbtn.png" alt="metamask button" /> Metamask
            </button>
            );
        }
    }

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
            >
                <Badge color="primary">
                    {logoImageUrl?(
                        <Avatar
                            variant={accountLogo?"":"square"}
                            alt="user" src={logoImageUrl}
                            sx={{ width: 32, height: 32 }}
                        />
                    ):(
                        <Icon icon={userLock}/>
                    )}
                </Badge>
            </IconButton>
            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.5,
                        overflow: 'inherit',
                        border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
                        width: 220,
                    }
                }}
            >
                {account ? (
                        <>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href={`/`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="account_profile"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <Badge color="primary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Buy Crypto</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/create-item`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="create"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AddPhotoAlternateIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Create NFT</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://explorer.testnet.mantle.xyz/address/${account}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {account}
                                    </Typography>
                                </Link>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" onClick={handleLogout} size="small">
                                        Logout
                                    </Button>
                                    <CopyToClipboard text={account} onCopy={()=>{}}>
                                        <Button variant="outlined" size="small">
                                            Copy
                                        </Button>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <MenuItem
                            key="wallet"
                            onClick={() =>{handleShow(); handleClose()}}
                            sx={{ typography: 'body2', py: 2, px: 2.5 }}
                        >
                            <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                <Typography variant='s3' style={{marginLeft: '10px'}}>Wallet Connect</Typography>
                            </Stack>
                        </MenuItem>
                )}
            </Popover>
            <Modal show={show} onHide={handleClose1}>
                <Modal.Header closeButton>
                <Modal.Title>Connect Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="connectbtns">
                    {loadMetamaskbutton()}
                    <button
                    className="btn btn-clear wlpadding walletc"
                    onClick={() => {
                        console.log("Login");
                        connect(1);
                    }}
                    >
                    <img src="/wbtn.png" alt="metamask button" width="40" /> Wallet
                    Connect
                    </button>

                    <button
                    className="btn btn-clear wlpadding"
                    onClick={() => {
                        console.log("Login");
                        connect(2);
                    }}
                    >
                    <img src="/coin.png" alt="metamask button" width="40" /> Coinbase
                    </button>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
