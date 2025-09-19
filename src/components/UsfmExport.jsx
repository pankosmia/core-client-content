import {useRef, useContext, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    OutlinedInput,
    Typography
} from "@mui/material";
import {getText, debugContext, i18nContext, doI18n} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import {saveAs} from 'file-saver';

function UsfmExport({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState([]);

    const usfmExportOneBook = async bookCode => {
        const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
        const bookUsfmResponse = await getText(bookUrl, debugRef.current);
        if (!bookUsfmResponse.ok) {
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                {variant: "error"}
            );
            return false;
        }
        let blob = new Blob([bookUsfmResponse.text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${bookCode}.usfm`);
        enqueueSnackbar(
            `${doI18n("pages:content:saved", i18nRef.current)} ${bookCode} ${doI18n("pages:content:to_download_folder", i18nRef.current)}`,
            {variant: "success"}
        );
        return true;
    }

    const handleBooksChange = (event) => {
        const value = event.target.value;
        setSelectedBooks(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle sx={{ backgroundColor: 'secondary.main' }}><b>{doI18n("pages:content:export_as_usfm", i18nRef.current)}</b></DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
            <DialogContentText>
                <Typography>
                    {doI18n("pages:content:pick_one_or_more_books_export", i18nRef.current)}
                </Typography>
            </DialogContentText>
            <Select
                variant="standard"
                multiple
                displayEmpty
                defaultOpen={true}
                value={selectedBooks}
                onChange={handleBooksChange}
                input={<OutlinedInput/>}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>{doI18n("pages:content:books", i18nRef.current)}</em>;
                    }
                    fileExport.current = selected;
                        return (
                            <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                              {selected
                                  .map(s=>doI18n(`scripture:books:${s}`, i18nRef.current))
                                  .join(', ')}
                            </Box>
                        );
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 224,
                            width: 250,
                        },
                    }
                }}
                inputProps={{'aria-label': 'Without label'}}
            >
                <MenuItem disabled value="">
                    <em>{doI18n("pages:content:books", i18nRef.current)}</em>
                </MenuItem>
                {bookNames.map((bookName) => (
                    <MenuItem
                        key={bookName}
                        value={bookName}
                    >
                        {doI18n(`scripture:books:${bookName}`, i18nRef.current)}
                    </MenuItem>
                ))}
            </Select>
        </DialogContent>
        <DialogActions>
            <Button
                variant="text"
                color="primary"
                onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant="contained"
                color="primary"
                disabled={!fileExport.current || fileExport.current.length === 0}
                onClick={() => {
                    if (!fileExport.current || fileExport.current.length === 0) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        fileExport.current.forEach(usfmExportOneBook);
                    }
                    closeFn();
                }}
            >
                {doI18n("pages:content:export_label", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default UsfmExport;
