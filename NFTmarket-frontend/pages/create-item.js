import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import React from 'react';
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Card
} from '@mui/material';
import Page from 'src/components/Page';
import { useRouter } from 'next/router'
import styled from 'styled-components';
import ImageIcon from '@mui/icons-material/Image';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'
import FormData from 'form-data';
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import { Modal } from "react-bootstrap";

import { useWeb3React } from "@web3-react/core";

import {
  createToken,
  listToken
} from "src/lib/contractMethods"

export default function Minting() {

  const router = useRouter()
  const [nftName, setNftName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
  const fileRef = useRef();
  const [fileUrl, setFileUrl] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tokenid, setTokenid] = useState(null)
  const [tokenuri, setTokenuri] = useState(null)
  const create_url = "http://135.181.234.78/api/upload"
  const { account, active, library, chainId } = useWeb3React();

  const [show, setShow] = useState({
    show: false,
    title: "",
    link: "",
    progress: false,
    dismiss: false,
    buttonText: "",
  });
  const handleClose = () => setShow(false);
  function showMintModal(state, title, link, progress, dismiss, buttonText) {
    setShow({
      show: state,
      title,
      link,
      progress,
      dismiss,
      buttonText,
    });
  }

  const handleFileSelect = (e) => {
      const pickedFile = e.target.files[0]

      const reader = new FileReader()
      if (pickedFile) {
          setFile(pickedFile)

          // This is used as src of image
          reader.readAsDataURL(pickedFile)
          reader.onloadend = function (e) {
              setFileUrl(reader.result)
          }
      }
  }

  const uploadfile = async () => {

      // TODO: Called only when the file is uploaded to site.
      if (!nftName || !description || !price || !fileUrl) {
        openSnackbar('Please fillout data', 'error')
        return
      }
      setLoading(true)
      if (file) {
          try {
              const formData = new FormData()
              formData.append("file", file)
              formData.append("name", nftName)
              formData.append("description", description)
              console.log('uploading image to ipfs')
              const response = await axios.post(
                  create_url,
                  formData
              )
              if(response.result === 'success'){
                openSnackbar('NFT uploading success')
                setTokenuri(response.data)
              }
              else{
                openSnackbar('NFT uploading failed', 'error')
              }
          } catch (e) {
              console.log(e)
              openSnackbar(e.message, 'error')
          }
      }
      setLoading(false)
  }

  const handleResetFile = (e) => {
      e.stopPropagation()
      setFileUrl(null)
      fileRef.current.value = null
  }

  const NFTUploader = () => {
    return(
      <CardWrapper>
          <input
              ref={fileRef}
              style={{ display: 'none' }}
              // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
              accept='image/*'
              id='contained-button-file'
              multiple
              type='file'
              onChange={handleFileSelect}
          />
          <Card
              sx={{
                  display: 'flex',
                  width: 320,
                  height: 240,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                  position: 'relative'
              }}
          >
              <CardOverlay
                  onClick={() => fileRef.current.click()}
              >
                  <IconButton
                      aria-label='close' onClick={(e) => handleResetFile(e)}
                      sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                  >
                      <CloseIcon color='white' />
                  </IconButton>
              </CardOverlay>
              <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', height: '100%', overflow:'hidden'} : { display: 'none' }} />
              <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
          </Card>
          <Stack>
              <LoadingButton
                  loading={loading}
                  loadingPosition='start'
                  startIcon={<SendIcon />}
                  onClick={uploadfile}
              >
                  Upload
              </LoadingButton>
          </Stack>
          <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
      </CardWrapper>
    )
  }

  async function mintNFT(uri){
    try{
      let tx = await createToken(uri, library?.getSigner());
      showMintModal(
        true,
        "Mint submitted",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        true,
        false,
        ""
      );
      tx = await tx.wait(1);
      showMintModal(
        true,
        "Mint Success",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        false,
        true,
        "Done"
      );
      let event = tx.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
      setTokenid(tokenId);
    } catch(e){
      console.log(e)
    }
  }

  async function listNFT(tokenid){
    try{
      let tx = await listToken(tokenid, price, library?.getSigner());
      showMintModal(
        true,
        "List submitted",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        true,
        false,
        ""
      );
      tx = await tx.wait(1);
      showMintModal(
        true,
        "List Success",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        false,
        true,
        "Done"
      );
      router.push('/')
    } catch(e){
      console.log(e)
    }
  }

  return (
    <Page title='Create - NFT'>
      <Container maxWidth='md' sx={{ marginBottom: '3vh' }}>
        
        <Stack spacing={2} marginBottom={3}>
          <Typography variant="h4" >
            Create New NFT
          </Typography>
          <Typography variant='caption'>Name</Typography>
          <TextField required placeholder='Asset Name' margin='dense'
            onChange={(e) => {
              setNftName(e.target.value)
            }}
            value={nftName}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption' >Description</Typography>
          <TextField
            placeholder='Provide a detailed description of your NFT'
            margin='dense'
            multiline
            maxRows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1,
                minHeight: 10
              },
              '& .MuiOutlinedInput-root': {
                height: 100,
                alignItems: 'start'
              }
            }} />
        </Stack>

        <Stack spacing={2} marginBottom={3}>
          <Typography variant='caption'>Price</Typography>
          <TextField
            required placeholder='NFT Price'
            margin='dense'
            onChange={(e) => {
              setPrice(e.target.value)
            }}
            value={price}
            sx={{
              '&.MuiTextField-root': {
                marginTop: 1
              }
            }} />
        </Stack>
        
        <Stack spacing={2} marginBottom={3}>
          
          <Typography variant='caption'>
            Image, Video, Audio, or 3D Model
          </Typography>
          <NFTUploader />
        </Stack>
        <Stack spacing={2} marginBottom={3} direction="row">
          <Button
            sx={{ padding: 1, width:'35%' }}
            onClick={() => mintNFT(tokenuri)}
            variant='contained'
          >
            Mint NFT
          </Button>
          <Button
            sx={{ padding: 1, width:'35%' }}
            onClick={() => listNFT(tokenid)}
            variant='contained'
          >
            List NFT
          </Button>
        </Stack>
      </Container>
      <div className="mintmodalcontainer">
        <Modal show={show.show} onHide={handleClose} className="mymodal">
          <Modal.Body>
            <div className="mintmodal">
              <img
                src="/success.png"
                className="mintmodalimage"
                alt="Mintmodalimage"
              />

              <h2>{show.title}</h2>
              <h3>
                See the transaction on
                <a href={show.link} target="_blank" rel="noreferrer">
                  {" "}
                  Matle Explorer
                </a>
              </h3>
              {show.progress && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              )}
              <h3>{show.body}</h3>

              {show.dismiss && (
                <button className="btn herobtn" onClick={handleClose}>
                  {show.buttonText}
                </button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Page >
  );
}
const CardWrapper = styled.div`
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`

const CardOverlay = styled.div`
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: black;
  inset: 0;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.6;
  }
  }
`