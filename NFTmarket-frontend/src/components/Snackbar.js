import * as React from 'react';

// Material
import {
    Alert as MuiAlert,
    Slide,
    Snackbar
} from '@mui/material';

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export default function XSnackbar({ isOpen, close, message, variant }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        close()
    };

    return (
        <Snackbar
            open={isOpen}
            key='key_self_snackbar'
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical:'top', horizontal:'right' }}
            TransitionComponent={TransitionLeft}
        >
            <MuiAlert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
}
