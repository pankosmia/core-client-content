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
import {Packer} from "docx";
console.log("Packer", Packer)

function DocxExport({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState([]);
    const { Proskomma } = require('proskomma-core');
    const { SofriaRenderFromProskomma } = require('proskomma-json-tools');
    const actions = require("./docxActions.js");

    const docxExportOneBook = async bookCode => {
        const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
        const bookUsfmResponse = await getText(bookUrl, debugRef.current);
        if (!bookUsfmResponse.ok) {
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                {variant: "error"}
            );
            return false;
        }
        const pk = new Proskomma();

        pk.importDocument(
            {
                lang: "xxx",
                "abbr": "yyy"
            },
            "usfm",
            bookUsfmResponse.text
        );
        const docId = pk.gqlQuerySync('{documents { id } }').data.documents[0].id;
        const cl = new SofriaRenderFromProskomma({proskomma: pk, actions});
        const output = {};
        cl.renderDocument({docId, config: {}, output});
        console.log(output);
        const docxDoc = await Packer.toBuffer(output.doc);
        let blob = new Blob([docxDoc], {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${bookCode}.docxDoc`);
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
        <DialogTitle><b>{doI18n("pages:content:export_as_usfm", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <Select
                variant="standard"
                multiple
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
                    if (!fileExport.current || fileExport.current.length === 0) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        fileExport.current.forEach(docxExportOneBook);
                    }
                    closeFn();
                }}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default DocxExport;
