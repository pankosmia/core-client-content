import {useContext, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {getText, debugContext, i18nContext, doI18n} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import {saveAs} from 'file-saver';
import Color from 'color';

function UsfmExport({bookNames, repoSourcePath, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
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

    // Lighten secondary.main color
    const theme = useTheme();
    const lightenedColor = Color(theme.palette.secondary.main).lighten(0.8).hex();
    const lightenedColorHover = Color(theme.palette.secondary.main).lighten(0.999).hex();

    const handleToggle = (item) => {
      setSelectedBooks((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
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
        <DialogContent sx={{ mt: 1 }} style={{ overflow: "hidden"}}>
          <Box sx={{ maxHeight: '269px' }}>
            <DialogContentText>
                <Typography>
                    {doI18n("pages:content:pick_one_or_more_books_export", i18nRef.current)}
                </Typography>
            </DialogContentText>
            <List
                dense
                style={{ maxHeight: 300, overflowY: 'auto' }}
            >
              {bookNames.map((bookName) => (
                    <ListItem
                        key={bookName}
                        button
                        onClick={() => handleToggle(bookName)}
                        sx={{
                          backgroundColor: selectedBooks.includes(bookName) ? lightenedColor : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedBooks.includes(bookName) ? lightenedColorHover : 'action.hover',
                          },
                        }}
                    >
                        <ListItemText primary={doI18n(`scripture:books:${bookName}`, i18nRef.current)} />
                    </ListItem>
                ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button
                variant="text"
                color="primary"
                onClick={() => {
                  closeFn()
                  setSelectedBooks([]);
                }}
            >
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant="contained"
                color="primary"
                disabled={selectedBooks.length === 0}
                onClick={() => {
                    if (!selectedBooks || selectedBooks.length === 0) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        selectedBooks.forEach(usfmExportOneBook);
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
