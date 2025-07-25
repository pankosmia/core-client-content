import { useState, useContext, useEffect } from 'react';
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
import { Close as CloseIcon } from '@mui/icons-material';
import { enqueueSnackbar } from "notistack";
import { i18nContext, debugContext, postJson, doI18n } from "pithekos-lib";

export default function NewOBSContent({ open, closeModal, reposModCount, setReposModCount }) {
    const handleClose = () => {
        closeModal();
    }
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("textStories");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");

    const [postCount, setPostCount] = useState(0);

    useEffect(
        () => {
            setContentName("");
            setContentAbbr("");
            setContentLanguageCode("und");
        },
        [postCount]
    );

    const handleCreate = async () => {

        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_language_code: contentLanguageCode,
        };
        const response = await postJson(
            "/git/new-obs-resource",
            JSON.stringify(payload),
            debugRef.current
        );
        if (response.ok) {
            setPostCount(postCount + 1);
            setReposModCount(reposModCount + 1);
            enqueueSnackbar(
                doI18n("pages:content:content_created", i18nRef.current),
                { variant: "success" }
            );
        } else {
            enqueueSnackbar(
                `${doI18n("pages:content:content_creation_error", i18nRef.current)}: ${response.status}`,
                { variant: "error" }
            );
        }
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
                        {doI18n("pages:content:create_content_obs", i18nRef.current)}
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        disabled={
                            !(
                                contentName.trim().length > 0 &&
                                contentAbbr.trim().length > 0 &&
                                contentType.trim().length > 0 &&
                                contentLanguageCode.trim().length > 0
                            )
                        }
                        onClick={handleCreate}
                    >
                        {doI18n("pages:content:create", i18nRef.current)}
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} sx={{ m: 2 }}>
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
                    disabled={true}
                    sx={{ display: "none" }}
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