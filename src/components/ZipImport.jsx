import {useContext, useState, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {i18nContext, doI18n} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import { useZipUsfmFileInput } from 'zip-project';

function ZipImport({open,closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const [newImport, setNewImport] = useState(true);
    const [usfmArray, setUsfmArray] = useState([]);

    //This is temporary
    const newClick = () => {
      setNewImport(true);
    }

    const handleZipLoad = (usfmData, file) => {
      setUsfmArray([...usfmData]);
    }

    const {
      status,
      isLoading,
      invalidFileType,
      uploadError,
      onChange,
      onSubmit
    } = useZipUsfmFileInput(handleZipLoad)

    useEffect(() => {
      if (isLoading) {
        enqueueSnackbar(
            doI18n("pages:content:loading", i18nRef.current),
            {variant: "warning"}
        );
      }
    }, [isLoading]);

    // uploadError (from the RCL) may not not necessarily be reset after a successful upload (not yet experienced)
    useEffect(() => {
      if (newImport && uploadError) {
        enqueueSnackbar(
            `${doI18n("pages:content:import_error", i18nRef.current)} ${uploadError.message}`,
            {variant: "error"}
        );
        setNewImport(false);
      }
    }, [newImport, uploadError]);


    // invalidFileType (from the RCL) is not reset after a successful upload
    useEffect(() => {
      if (newImport && invalidFileType) {
        enqueueSnackbar(
            `${doI18n("pages:content:invalid_file_type", i18nRef.current)} ${invalidFileType}`,
            {variant: "error"}
        );
        setNewImport(false);
      }
    }, [invalidFileType, newImport]);

    useEffect(() => {
      if (status === 'UPLOAD_SUCCESS') {
        console.log(usfmArray);
        enqueueSnackbar(
            doI18n("pages:content:successful_upload", i18nRef.current),
            {variant: "success"}
        );
      }
    }, [usfmArray]);
  
    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle sx={{ backgroundColor: 'secondary.main' }}><b>{doI18n("pages:content:import_content", i18nRef.current)}</b></DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
            <DialogContentText>
              <input
                type='file'
                accept='.zip'
                onChange={onChange}
              />
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    newClick();
                    onSubmit();
                    closeFn();
                }}
            >
              {doI18n("pages:content:import", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default ZipImport;