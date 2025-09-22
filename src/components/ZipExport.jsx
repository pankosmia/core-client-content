import {useRef, useContext, useState, useEffect} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select
} from "@mui/material";
import {getText, debugContext, i18nContext, doI18n, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import { useExportUsfmZip } from 'zip-project';

function ZipExport({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState(bookNames);
    const [bookCodes, setBookCodes] = useState([]);
    const [zipSet, setZipSet] = useState('all');
    
    let newZip = [];
    const usfmExportZip = async () =>{
      for (const bookCode of zipSetBooks) {
        await usfmExportZipContents(bookCode);
      }
      const zippedFiles = newZip.map(item => item.filename).join(', ');
      handleExportZip();
      enqueueSnackbar(
          `${doI18n("pages:content:saved", i18nRef.current)} usfm_files.zip ${doI18n("pages:content:to_download_folder", i18nRef.current)}. ${doI18n("pages:content:contents", i18nRef.current)}: ${zippedFiles}`,
          {variant: "success"}
      );
    }

    const usfmExportZipContents = async bookCode => {
        const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
        const bookUsfmResponse = await getText(bookUrl, debugRef.current);
        if (!bookUsfmResponse.ok) {
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                {variant: "error"}
            );
            return false;
        }
        const usfmFile = {filename: `${bookCode}.usfm`, usfmText: `${bookUsfmResponse.text}`};
        newZip.push(usfmFile);
        return true;
    }
    
    const { handleExportZip } = useExportUsfmZip(newZip);

    const handleBooksChange = (event) => {
        const value = event.target.value;
        setSelectedBooks(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const zipSetBooks = (zipSet === 'all' ? bookNames : fileExport.current)

    const handleZipSetChange = (event, newValue) => {
      setZipSet(newValue);
      if (newValue === 'all') {
        setSelectedBooks(bookNames);
      } else {
        setSelectedBooks([]);
      }
    };

    useEffect(
        () => {
            const doFetch = async () => {
                const versificationResponse = await getJson("/content-utils/versification/eng", debugRef.current);
                if (versificationResponse.ok) {
                    setBookCodes(Object.keys(versificationResponse.json.maxVerses));
                }
            };
            if (bookCodes.length === 0) {
                doFetch().then();
            }
        },
        []
    );

    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle sx={{ backgroundColor: 'secondary.main' }}><b>{doI18n("pages:content:export_as_zip", i18nRef.current)}</b></DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
            {
            zipSet !== 'all' &&
                <Select
                    variant="standard"
                    multiple
                    displayEmpty
                    disabled={zipSet === 'all'}
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
                    {bookCodes.filter(item => bookNames.includes(item)).map((bookName) => (
                        <MenuItem
                            key={bookName}
                            value={bookName}
                        >
                            {`${bookName} - ` + doI18n(`scripture:books:${bookName}`, i18nRef.current)}
                        </MenuItem>
                    ))}
                </Select>
            }
            <DialogContentText>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue="all"
                    name="radio-buttons-group"
                    onChange={handleZipSetChange}
                  >
                    <FormControlLabel value="pick" control={<Radio />} label={doI18n("pages:content:pick_one_or_more_books_export", i18nRef.current)} />
                    <FormControlLabel value="all" control={<Radio />} label={doI18n("pages:content:export_all", i18nRef.current)} />
                  </RadioGroup>
                </FormControl>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button 
                variant="text"
                color="primary"
                onClick={closeFn}
             >
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    if (!zipSetBooks || zipSetBooks.length === 0) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        usfmExportZip(zipSetBooks);
                    }
                    closeFn();
                }}
            >
                {doI18n("pages:content:export_label", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default ZipExport;
