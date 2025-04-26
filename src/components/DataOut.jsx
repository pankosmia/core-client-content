import { useRef, useContext, useState, useCallback, useEffect } from 'react';
import { Grid2, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, OutlinedInput, Typography } from "@mui/material";
import { getText, debugContext, i18nContext, doI18n } from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import { saveAs } from 'file-saver';

function DataOut(dataOutProps) {
  const {
    bookNames,
    repoSourcePath,
  } = dataOutProps;
  const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 64);
  const handleWindowResize = useCallback(event => {
    setMaxWindowHeight(window.innerHeight - 64);
  }, []);

  const {i18nRef} = useContext(i18nContext);
  const {debugRef} = useContext(debugContext);

  const [open, setOpen] = useState(false);

  const fileExport = useRef();
  
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
        window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);
  

  function InputButton() {

    const [selectedValue, setSelectedValue] = useState([]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setSelectedValue(
        typeof value === 'string' ? value.split(',') : value,
      );
    };
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          {doI18n("pages:content:save_book_file", i18nRef.current)}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              component: 'form',
              
            },
          }}
        >
          <DialogTitle><b>{doI18n("pages:content:export_as_usfm", i18nRef.current)}</b></DialogTitle>
          <DialogContent>
            <Select
              multiple
              displayEmpty
              value={selectedValue}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>{doI18n("pages:content:books", i18nRef.current)}</em>;
                }

                fileExport.current = selected;

                return selected.join(', ');

              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
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
            <Button onClick={handleClose}>{doI18n("pages:content:cancel", i18nRef.current)}</Button>
            <Button 
              onClick={() => {
                  fileExport.current.forEach(
                    async (bookCode, i) => {
                      const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
                      const bookUsfmResponse = await getText(bookUrl, debugRef.current);
                      if (!bookUsfmResponse.ok){
                        console.log(`Could not fetch ${bookCode}`)
                        enqueueSnackbar(
                          `${doI18n("pages:content:couldnt_fetch", i18nRef.current)} ${bookCode}`,
                          {variant: "error"}
                        );
                        return
                      }
                      let blob = new Blob([bookUsfmResponse.text], {type: "text/plain;charset=utf-8"});
                      saveAs(blob, `${bookCode}.usfm`);
                      enqueueSnackbar(
                        `${doI18n("pages:content:saved", i18nRef.current)} ${bookCode} ${doI18n("pages:content:to_download_folder", i18nRef.current)}`,
                        {variant: "success"}
                      );
                    }
              )}}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


  return <Grid2 container spacing={2} sx={{ maxHeight: maxWindowHeight }}>
      <Grid2 size={12}>
          <h2>{doI18n("pages:content:export_usfm", i18nRef.current)}</h2>
          <InputButton />
      </Grid2>
  </Grid2>
}

export default DataOut;
