import {useState} from 'react';
import {
    AppBar, Box,
    Button,
    Dialog,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText, Stack, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';

export default function NewPicker({open, setOpen}) {

    const handleClose = () => {
        setOpen(false);
    };

    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        New Project
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Create
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} sx={{mt: 2}}>
                <TextField
                    id="name"
                    label="Name"
                    value={contentName}
                    onChange={(event) => {
                        setContentName(event.target.value);
                    }}
                />
                <TextField
                    id="abbr"
                    label="Abbreviation"
                    value={contentAbbr}
                    onChange={(event) => {
                        setContentAbbr(event.target.value);
                    }}
                />
                <TextField
                    id="type"
                    label="Type"
                    value={contentType}
                    onChange={(event) => {
                        setContentType(event.target.value);
                    }}
                />
                <TextField
                    id="languageCode"
                    label="Language Code ('und' for undetermined)"
                    value={contentLanguageCode}
                    onChange={(event) => {
                        setContentLanguageCode(event.target.value);
                    }}
                />
            </Stack>
        </Dialog>
    );
}