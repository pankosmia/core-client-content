import {useState, useContext} from 'react';
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {i18nContext, doI18n} from "pithekos-lib";

export default function NewContent({open, setOpen}) {

    const handleClose = () => {
        setOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");

    const handleCreate = () => {
        console.log("CREATE");
        setOpen(false);
    };

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
                        aria-label={doI18n("pages:content:close", i18nRef.current)}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                    {doI18n("pages:content:new_content", i18nRef.current)}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleCreate}>
                    {doI18n("pages:content:create", i18nRef.current)}
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} sx={{mt: 2}}>
                <TextField
                    id="name"
                    label={doI18n("pages:content:name", i18nRef.current)}
                    value={contentName}
                    onChange={(event) => {
                        setContentName(event.target.value);
                    }}
                />
                <TextField
                    id="abbr"
                    label={doI18n("pages:content:abbreviation", i18nRef.current)}
                    value={contentAbbr}
                    onChange={(event) => {
                        setContentAbbr(event.target.value);
                    }}
                />
                <TextField
                    id="type"
                    label={doI18n("pages:content:type", i18nRef.current)}
                    value={contentType}
                    onChange={(event) => {
                        setContentType(event.target.value);
                    }}
                />
                <TextField
                    id="languageCode"
                    label={doI18n("pages:content:lang_code", i18nRef.current)}
                    value={contentLanguageCode}
                    onChange={(event) => {
                        setContentLanguageCode(event.target.value);
                    }}
                />
            </Stack>
        </Dialog>
    );
}