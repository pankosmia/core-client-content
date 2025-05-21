import { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Button, Checkbox,
    Dialog, FormControl, FormControlLabel, FormGroup,
    IconButton,
    Stack,
    TextField,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    InputLabel, Grid2
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import { enqueueSnackbar } from "notistack";
import { i18nContext, debugContext, postJson, doI18n, getAndSetJson, getJson } from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";

export default function NewBcvContent({ open, closeModal, }) {
    const {i18nRef} = useContext(i18nContext);
    const handleClose = () => {
        closeModal();
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label={doI18n("pages:content:close", i18nRef.current)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {doI18n("pages:content:create_content_bcvresources", i18nRef.current)}
                    </Typography>
                 
                </Toolbar>
            </AppBar>
        </Dialog>
    );
}