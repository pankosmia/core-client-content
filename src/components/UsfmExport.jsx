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

function UsfmExport({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedBooks(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                width: 250,
            },
        },
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
        <DialogTitle><b>{doI18n("pages:content:export_as_usfm", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <Select
                variant="standard"
                multiple
                displayEmpty
                value={selectedBooks}
                onChange={handleChange}
                input={<OutlinedInput/>}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>{doI18n("pages:content:books", i18nRef.current)}</em>;
                    }
                    fileExport.current = selected;
                    return selected.join(', ');
                }}
                MenuProps={MenuProps}
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
                    {doI18n("pages:content:pick_book_export", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                onClick={() => {
                    fileExport.current.forEach(
                        async (bookCode, i) => {
                            const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
                            const bookUsfmResponse = await getText(bookUrl, debugRef.current);
                            if (!bookUsfmResponse.ok) {
                                console.log(`Could not fetch ${bookCode}`)
                                enqueueSnackbar(
                                    `${doI18n("pages:content:couldnt_fetch", i18nRef.current)} ${bookCode}`,
                                    {variant: "error"}
                                );
                                return;
                            }
                            let blob = new Blob([bookUsfmResponse.text], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, `${bookCode}.usfm`);
                            enqueueSnackbar(
                                `${doI18n("pages:content:saved", i18nRef.current)} ${bookCode} ${doI18n("pages:content:to_download_folder", i18nRef.current)}`,
                                {variant: "success"}
                            );
                        }
                    );
                    closeFn();
                }}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default UsfmExport;
