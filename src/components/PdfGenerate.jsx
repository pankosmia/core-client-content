import {useRef, useContext, useState} from 'react';
import {
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

function PdfGenerate({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState([]);

    const generatePdf = async bookCode => {
        const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
        const bookUsfmResponse = await getText(bookUrl, debugRef.current);
        if (!bookUsfmResponse.ok) {
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                {variant: "error"}
            );
            return false;
        }
        console.log("PDF GENERATED HERE");
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
        <DialogTitle><b>{doI18n("pages:content:generate_as_pdf", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <Select
                variant="standard"
                displayEmpty
                value={selectedBooks}
                onChange={handleBooksChange}
                input={<OutlinedInput/>}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>{doI18n("pages:content:books", i18nRef.current)}</em>;
                    }
                    fileExport.current = selected;
                    return selected.join(', ');
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
                        {bookName}
                    </MenuItem>
                ))}
            </Select>
            <DialogContentText>
                <Typography>
                    {doI18n("pages:content:pick_one_book_export", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                onClick={() => {
                    if (!fileExport.current || fileExport.current.length === 0) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        generatePdf(fileExport.current[0]).then();
                    }
                    closeFn();
                }}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PdfGenerate;
