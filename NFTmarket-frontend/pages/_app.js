import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import Header from 'src/components/Header';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import "styles/globals.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

function NFTmarket(props) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />

                <link rel="manifest" href="/site.webmanifest" />
                {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#121619" /> */}
                <meta name="msapplication-TileColor" content="#121619" />
                <meta name="theme-color" content="#ffffff"/>
            </Head>
            <Web3ReactProvider getLibrary={getLibrary}>
                <ContextProvider openSnackbar={openSnackbar}>
                    <ThemeProvider>
                        <SnackbarProvider maxSnack={3}>
                            <CssBaseline />
                            <Header />
                            <Component {...pageProps}/>
                            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
                        </SnackbarProvider>
                    </ThemeProvider>
                </ContextProvider>
            </Web3ReactProvider>
        </>
    );
}

export default NFTmarket;
