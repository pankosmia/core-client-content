import {useState, useContext, useEffect} from 'react';
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
import {Close as CloseIcon} from '@mui/icons-material';
import {enqueueSnackbar} from "notistack";
import {i18nContext, debugContext, postJson, doI18n, getJson} from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";

export default function NewTextTranslationBook({repoInfo, open, setOpen, reposModCount, setReposModCount}) {

    const [addCV, setAddCV] = useState(true);
    const [bookCode, setBookCode] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookAbbr, setBookAbbr] = useState("");

    useEffect(
        () => {
            const doFetch = async () => {
                const versificationResponse = await getJson("/content-utils/versification/eng", debugRef.current);
                if (versificationResponse.ok) {
                    const newBookCodes = Object.keys(versificationResponse.json.maxVerses);
                    setBookCodes(newBookCodes);
                }
                setBookCode("");
                setBookTitle("");
                setBookAbbr("");
            };
            doFetch().then();
        },
        [open, repoInfo]
    );

    const handleClose = () => {
        setOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [bookCodes, setBookCodes] = useState([]);
    const [protestantOnly, setProtestantOnly] = useState(true);

    useEffect(
        () => {
        },
        []
    );

    const handleCreate = async () => {

        const payload = {
            book_code: bookCode,
            book_title: bookTitle,
            book_abbr: bookAbbr,
            add_cv: addCV
        };
        const response = await postJson(
            `/git/new-scripture-book/${repoInfo.path}`,
            JSON.stringify(payload),
            debugRef.current
        );
        if (response.ok) {
            setReposModCount(reposModCount + 1);
            enqueueSnackbar(
                doI18n("pages:content:book_created", i18nRef.current),
                {variant: "success"}
            );
        } else {
            enqueueSnackbar(
                `${doI18n("pages:content:book_creation_error", i18nRef.current)}: ${response.status}`,
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
                        {doI18n("pages:content:new_book", i18nRef.current)}
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        disabled={
                            !(
                                bookCode.trim().length === 3 &&
                                bookTitle.trim().length > 0 &&
                                bookAbbr.trim().length > 0
                            )
                        }
                        onClick={handleCreate}
                    >
                        {doI18n("pages:content:create", i18nRef.current)}
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} sx={{m: 2}}>
                <Grid2 container spacing={2} justifyItems="flex-end" alignItems="stretch">
                    <Grid2 item size={2}>
                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="bookCode-label" htmlFor="bookCode" sx={sx.inputLabel}>
                                {doI18n("pages:content:book_code", i18nRef.current)}
                            </InputLabel>
                            <Select
                                variant="outlined"
                                labelId="bookCode-label"
                                name="bookCode"
                                inputProps={{
                                    id: "bookCode",
                                }}
                                value={bookCode}
                                label={doI18n("pages:content:book_code", i18nRef.current)}
                                onChange={(event) => {
                                    setBookCode(event.target.value);
                                    setBookAbbr(
                                        ["1", "2", "3"].includes(event.target.value[0]) ?
                                            event.target.value.slice(0, 2) + event.target.value[2].toLowerCase() :
                                            event.target.value[0] + event.target.value.slice(1).toLowerCase()
                                    );
                                    setBookTitle(doI18n(`scripture:books:${event.target.value}`, i18nRef.current))
                                }}
                                sx={sx.select}
                            >
                                {
                                    (protestantOnly ? bookCodes.slice(0, 66) : bookCodes).map((listItem, n) => <MenuItem
                                            key={n}
                                            value={listItem}
                                            dense
                                            disabled={repoInfo.bookCodes.includes(listItem)}
                                        >
                                            <ListMenuItem
                                                listItem={`${listItem} - ${doI18n(`scripture:books:${listItem}`, i18nRef.current)}`}
                                            />
                                        </MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={protestantOnly}
                                        onChange={() => setProtestantOnly(!protestantOnly)}
                                    />
                                }
                                label={doI18n("pages:content:protestant_books_only", i18nRef.current)}
                            />
                        </FormGroup>
                    </Grid2>
                    <Grid2 item size={2}>
                        <TextField
                            id="bookAbbr"
                            sx={{width: "100%"}}
                            label={doI18n("pages:content:book_abbr", i18nRef.current)}
                            value={bookAbbr}
                            onChange={(event) => {
                                setBookAbbr(event.target.value);
                            }}
                        />
                    </Grid2>
                    <Grid2 item size={8}>
                        <TextField
                            id="bookTitle"
                            sx={{width: "100%"}}
                            label={doI18n("pages:content:book_title", i18nRef.current)}
                            value={bookTitle}
                            onChange={(event) => {
                                setBookTitle(event.target.value);
                            }}
                        />
                    </Grid2>
                </Grid2>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={addCV}
                                onChange={() => setAddCV(!addCV)}
                            />
                        }
                        label={doI18n("pages:content:add_versification_checkbox", i18nRef.current)}
                    />
                </FormGroup>
            </Stack>
        </Dialog>
    );
}