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
import {i18nContext, debugContext, postJson, doI18n, getAndSetJson} from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";

export default function NewContent({open, setOpen,}) {

    const handleClose = () => {
        setOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [contentName, setContentName] = useState("");
    const [contentAbbr, setContentAbbr] = useState("");
    const [contentType, setContentType] = useState("text_translation");
    const [contentLanguageCode, setContentLanguageCode] = useState("und");
    const [showBookFields, setShowBookFields] = useState(false);
    const [bookCode, setBookCode] = useState("TIT");
    const [bookTitle, setBookTitle] = useState("Tit");
    const [bookAbbr, setBookAbbr] = useState("Ti");
    const [postCount, setPostCount] = useState(0);
    const [showVersification, setShowVersification] = useState(false);
    const [versification, setVersification] = useState("eng");

    const [versificationCodes, setVersificationCodes] = useState([]);

    useEffect(() =>
            getAndSetJson({
                url: "/content-utils/versifications",
                setter: setVersificationCodes
            }).then(),
        []
    );

    const bookCodes = [
        {code: 'GEN', id: '01'},
        {code: 'EXO', id: '02'},
        {code: 'LEV', id: '03'},
        {code: 'NUM', id: '04'},
        {code: 'DEU', id: '05'},
        {code: 'JOS', id: '06'},
        {code: 'JDG', id: '07'},
        {code: 'RUT', id: '08'},
        {code: '1SA', id: '09'},
        {code: '2SA', id: '10'},
        {code: '1KI', id: '11'},
        {code: '2KI', id: '12'},
        {code: '1CH', id: '13'},
        {code: '2CH', id: '14'},
        {code: 'EZR', id: '15'},
        {code: 'NEH', id: '16'},
        {code: 'EST', id: '17'},
        {code: 'JOB', id: '18'},
        {code: 'PSA', id: '19'},
        {code: 'PRO', id: '20'},
        {code: 'ECC', id: '21'},
        {code: 'SNG', id: '22'},
        {code: 'ISA', id: '23'},
        {code: 'JER', id: '24'},
        {code: 'LAM', id: '25'},
        {code: 'EZK', id: '26'},
        {code: 'DAN', id: '27'},
        {code: 'HOS', id: '28'},
        {code: 'JOL', id: '29'},
        {code: 'AMO', id: '30'},
        {code: 'OBA', id: '31'},
        {code: 'JON', id: '32'},
        {code: 'MIC', id: '33'},
        {code: 'NAM', id: '34'},
        {code: 'HAB', id: '35'},
        {code: 'ZEP', id: '36'},
        {code: 'HAG', id: '37'},
        {code: 'ZEC', id: '38'},
        {code: 'MAL', id: '39'},
        {code: 'MAT', id: '40'},
        {code: 'MRK', id: '41'},
        {code: 'LUK', id: '42'},
        {code: 'JHN', id: '43'},
        {code: 'ACT', id: '44'},
        {code: 'ROM', id: '45'},
        {code: '1CO', id: '46'},
        {code: '2CO', id: '47'},
        {code: 'GAL', id: '48'},
        {code: 'EPH', id: '49'},
        {code: 'PHP', id: '50'},
        {code: 'COL', id: '51'},
        {code: '1TH', id: '52'},
        {code: '2TH', id: '53'},
        {code: '1TI', id: '54'},
        {code: '2TI', id: '55'},
        {code: 'TIT', id: '56'},
        {code: 'PHM', id: '57'},
        {code: 'HEB', id: '58'},
        {code: 'JAS', id: '59'},
        {code: '1PE', id: '60'},
        {code: '2PE', id: '61'},
        {code: '1JN', id: '62'},
        {code: '2JN', id: '63'},
        {code: '3JN', id: '64'},
        {code: 'JUD', id: '65'},
        {code: 'REV', id: '66'},
    ]

    useEffect(
        () => {
            setContentName("");
            setContentAbbr("");
            setContentType("text_translation");
            setContentLanguageCode("und");
            setBookCode("TIT");
            setBookTitle("Titus");
            setBookAbbr("Ti");
            setShowBookFields(false);
            setShowVersification(false);
            setVersification("eng");
        },
        [postCount]
    );

    const handleCreate = async () => {

        const payload = {
            content_name: contentName,
            content_abbr: contentAbbr,
            content_type: contentType,
            content_language_code: contentLanguageCode,
            add_book: showBookFields,
            book_code: showBookFields ? bookCode : null,
            book_title: showBookFields ? bookTitle : null,
            book_abbr: showBookFields ? bookAbbr : null,
            add_cv: showBookFields ? showVersification : null,
            versification: showBookFields && showVersification ? versification : null
        };
        const response = await postJson(
            "/git/new",
            JSON.stringify(payload),
            debugRef.current
        );
        if (response.ok) {
            setPostCount(postCount + 1);
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
                                        bookAbbr.trim().length > 0 &&
                                        (
                                            !showVersification || (
                                                versification.trim().length === 3
                                            )
                                        )
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
                    disabled={true}
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
                                            setBookTitle("")
                                        }}
                                        sx={sx.select}
                                    >
                                        {
                                            bookCodes.map((listItem, n) => <MenuItem key={n} value={listItem.code} dense>
                                                    <ListMenuItem listItem={listItem.code}/>
                                                </MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>
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
                                        checked={showVersification}
                                        onChange={() => setShowVersification(!showVersification)}
                                    />
                                }
                                label={doI18n("pages:content:add_versification_checkbox", i18nRef.current)}
                            />
                        </FormGroup>
                        {
                            showVersification &&
                            <FormControl>
                                <InputLabel id="booksVersification-label" htmlFor="booksVersification"
                                            sx={sx.inputLabel}>
                                    {doI18n("pages:content:versification_scheme", i18nRef.current)}
                                </InputLabel>
                                <Select
                                    variant="outlined"
                                    labelId="booksVersification-label"
                                    name="booksVersification"
                                    inputProps={{
                                        id: "bookVersification",
                                    }}
                                    value={versification}
                                    label={doI18n("pages:content:versification_scheme", i18nRef.current)}
                                    onChange={(event) => {
                                        setVersification(event.target.value);
                                    }}
                                    sx={sx.select}
                                >
                                    {
                                        versificationCodes.map((listItem, n) => <MenuItem key={n} value={listItem}
                                                                                          dense>
                                                <ListMenuItem listItem={listItem}/>
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        }
                    </>
                }
            </Stack>
        </Dialog>
    );
}