import {useState, useContext} from 'react';
import {
    AppBar,
    Button, Checkbox,
    Dialog, FormControlLabel, FormGroup,
    IconButton,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {enqueueSnackbar} from "notistack";
import {i18nContext, debugContext, postJson, doI18n} from "pithekos-lib";

export default function NewContent({open, setOpen}) {

    const handleClose = () => {
        setOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");
    const [showBookFields, setShowBookFields] = useState(false);
    const [bookCode, setBookCode] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookAbbr, setBookAbbr] = useState("");

    const handleCreate = async () => {
        console.log("CREATE");
        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_type: contentType,
            content_language_code: contentLanguageCode,
            add_book: showBookFields,
            book_code: showBookFields ? bookCode : null,
            book_title: showBookFields ? bookTitle : null,
            book_abbr: showBookFields ? bookAbbr : null
        };
        const response = await postJson(
            "/git/new",
            payload,
            debugRef.current
        );
        if (response.ok) {
            enqueueSnackbar(
                doI18n("pages:content:content_created", i18nRef.current),
                {variant: "success"}
            );
        } else {
            enqueueSnackbar(
                `${doI18n("pages:content:content_creation_error", i18nRef.current)}: ${response.status}`,
                {variant: "error"}
            );
        }
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
                    <Button
                        autoFocus
                        color="inherit"
                        disabled={
                            !(
                                contentName.trim().length > 0 &&
                                contentAbbr.trim().length > 0 &&
                                contentType.trim().length > 0 &&
                                contentLanguageCode.trim().length > 0 &&
                                (
                                    !showBookFields || (
                                        bookCode.trim().length === 3 &&
                                        bookTitle.trim().length > 0 &&
                                        bookAbbr.trim().length > 0
                                    )
                                )
                            )
                        }
                        onClick={handleCreate}
                    >
                        {doI18n("pages:content:create", i18nRef.current)}
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} sx={{m: 2}}>
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
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showBookFields}
                                onChange={() => setShowBookFields(!showBookFields)}
                            />
                        }
                        label={doI18n("pages:content:add_book_checkbox", i18nRef.current)}
                    />
                </FormGroup>
                {
                    showBookFields && <>
                        <TextField
                            id="bookCode"
                            label={doI18n("pages:content:book_code", i18nRef.current)}
                            value={bookCode}
                            onChange={(event) => {
                                setBookCode(event.target.value);
                            }}
                        />
                        <TextField
                            id="bookTitle"
                            label={doI18n("pages:content:book_title", i18nRef.current)}
                            value={bookTitle}
                            onChange={(event) => {
                                setBookTitle(event.target.value);
                            }}
                        />
                        <TextField
                            id="bookAbbr"
                            label={doI18n("pages:content:book_abbr", i18nRef.current)}
                            value={bookAbbr}
                            onChange={(event) => {
                                setBookAbbr(event.target.value);
                            }}
                        />
                    </>
                }
            </Stack>
        </Dialog>
    );
}