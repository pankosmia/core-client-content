import {useContext, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Tooltip,
    AppBar,
    Toolbar,
    Typography
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {i18nContext, doI18n} from "pithekos-lib";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function ImportBurrito({ open, closeFn, reposModCount, setReposModCount }) {

    const {i18nRef} = useContext(i18nContext);
    const [loading, setLoading] = useState(false);
    const [filePicked, setFilePicked] = useState(null);
    const isZip = filePicked?.name?.toLowerCase().endsWith('.zip');

    const handleImport = async (file) => {
        const formData = new FormData();

        formData.append('file', file, "data.zip");

        const fileName = filePicked?.name?.replace(/\.[^/.]+$/, "");
        const response = await fetch(`/burrito/zipped/_local_/_sideloaded_/${encodeURIComponent(fileName)}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok){
            setFilePicked(null);
            enqueueSnackbar(
                doI18n("pages:content:burrito_imported", i18nRef.current),
                { variant: "success" }
            );
            setReposModCount(reposModCount + 1);
        } else {
            const error = await response.json(); 
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_import_burrito", i18nRef.current)}: ${error.reason}`,
                { variant: "error" }
            )
        };
    };
  
    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => { setFilePicked(null) ; closeFn() }}
            sx={{ backdropFilter: "blur(3px)" }}
            slotProps={{ paper: { component: 'form'} }}
        >
        <AppBar
            color="secondary"
            sx={{
                position: "relative",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:import_content", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent sx={{ mt: 1 }}>
            <FilePicker
                extensions={['zip']}
                onChange={(file) => {setFilePicked(file)}}
                onError={error => {enqueueSnackbar(`${error}`, {variant: "error",}); setLoading(false);}}
            >
                <Button 
                    type="button" 
                    disabled={loading}
                    variant="contained"
                    color="primary" 
                    component="span"
                    startIcon={<UploadFileIcon />}
                >
                    {loading ? 'Reading File...' : (filePicked?.name ? filePicked?.name : doI18n("pages:content:import_burrito_click", i18nRef.current))}
                </Button>
            </FilePicker>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { closeFn(); setFilePicked(null) }}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Tooltip 
                open={!isZip && filePicked}
                title={doI18n("pages:content:file_invalid", i18nRef.current)}
                placement="top-end"
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { handleImport(filePicked); closeFn(); setTimeout(() => setFilePicked(null), 1500); }}
                    disabled={!filePicked || !isZip}
                >
                    {doI18n("pages:content:create", i18nRef.current)}
                </Button>
            </Tooltip>
        </DialogActions>
    </Dialog>
    );
}

export default ImportBurrito;