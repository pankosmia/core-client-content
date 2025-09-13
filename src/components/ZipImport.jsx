import {useContext, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {i18nContext, doI18n} from "pithekos-lib";
import { useZipUsfmFileInput } from 'zip-project';

function ZipImport({open,closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const [usfmArray, setUsfmArray] = useState([])
    const handleZipLoad = (usfmData, file) => {
      setUsfmArray([...usfmData])
    }

    const {
      status,
      isLoading,
      invalidFileType,
      uploadError,
      onChange,
      onSubmit,
    } = useZipUsfmFileInput(handleZipLoad)

    if (isLoading) {
      return <div>Loading....</div>
    }

    if (uploadError) {
      return (
        <div>
          <h1>An Error occurred:</h1>
          <p>{uploadError.message}</p>
        </div>
      )
    }

    if (invalidFileType) {
      return (
        <div>
          <p>{`Invalid file upload: ${invalidFileType}`}</p>
        </div>
      )
    }

    if (status === 'UPLOAD_SUCCESS') {
      console.log(usfmArray);
    }

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
              <input type='file' accept='.zip' onChange={onChange} />
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