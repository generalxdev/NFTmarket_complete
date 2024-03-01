import { useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import {
    alpha, styled, useMediaQuery, useTheme,
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import HomeIcon from '@mui/icons-material/Home';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Logo from './Logo';
import Wallet from './Wallet';

const HeaderWrapper = styled(AppBar)(({ theme }) => `
    width: 100%;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    border: none;
    border-radius: 0px;
    border-bottom: 0px solid ${alpha('#CBCCD2', 0.2)};
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    // z-index: 1300;
`
);

export default function Header() {
    /*
    xs: 0,
    mobile: 450,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1840
    */
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { toggleTheme, darkMode } = useContext(AppContext);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const shareUrl = `https://bloxfi-dex.onrender.com/`;
    const shareTitle = 'BLOXFI is the Best DEX on Arbitrum network';
    const shareDesc = 'BLOXFI is a zero-fee dex platform for trading on Arbitrum network, providing token swapping and farming service.';

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    return (
        <HeaderWrapper position="sticky" enableColorOnDark={true} sx={{ py: 1 }}>
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <Box id='logo-container-laptop'
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', sm: 'flex' },
                        }}
                    >
                        <Logo />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {!isMobile &&
                            <>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text" className="mr-4 text-blue-500">Home</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create-item`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text" className="mr-6 text-blue-500">Create NFT
                                    </Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/my-assets`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text" className="mr-6 text-blue-500">My Digital Assets</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/creator-dashboard`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text" className="mr-6 text-blue-500">Creator Dashboard</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`https://3-dnft-gallery.vercel.app/`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">3D Gallery</Button>
                                </Link>
                                <Wallet />
                            </>
                        }
                        {!isMobile &&
                            <IconButton onClick={() => { toggleTheme() }} >
                                {darkMode ? (
                                    <Icon icon={baselineBrightness4} />
                                ) : (
                                    <Icon icon={baselineBrightnessHigh} />
                                )}
                            </IconButton>
                        }
                    </Box>

                    <Box id='nav-menu-mobile'
                        sx={{ flexGrow: 0, display: { sm: 'flex', md: 'none' } }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >

                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <HomeIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Home</Typography>
                                    </Stack>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create-item`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AddPhotoAlternateIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Create NFT</Typography>
                                    </Stack>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/my-assets`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <WebAssetIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>My Assets</Typography>
                                    </Stack>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/creator-dashboard`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <DashboardCustomizeIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Dashboard</Typography>
                                    </Stack>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/3d-gallery`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <ThreeDRotationIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>3D Gallery</Typography>
                                    </Stack>
                                </Link>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={()=> {toggleTheme();}}>
                                <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                    {darkMode ? (
                                        <Icon icon={baselineBrightness4} width={24} height={24} />
                                    ) : (
                                        <Icon icon={baselineBrightnessHigh} width={24} height={24} />
                                    )}
                                    <Typography variant='s3' style={{marginLeft: '10px'}}>{darkMode ? 'Dark Theme':'Light Theme'}</Typography>
                                </Stack>
                            </MenuItem>

                            <Stack alignItems="center" sx={{mt: 2}} >
                                <Stack direction="row" spacing={3}>
                                    <FacebookShareButton
                                        url={shareUrl}
                                        quote={shareTitle}
                                        hashtag={"#"}
                                        description={shareDesc}
                                    >
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>
                                    <TwitterShareButton
                                        title={shareTitle}
                                        url={shareUrl}
                                        hashtag={"#"}
                                    >
                                        <TwitterIcon size={32} round />
                                    </TwitterShareButton>
                                </Stack>
                            </Stack>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </HeaderWrapper >
    );
}
