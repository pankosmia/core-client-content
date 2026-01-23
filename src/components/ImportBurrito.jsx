import { useContext, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Tooltip,
    AppBar,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { i18nContext, doI18n } from "pithekos-lib";
import { FilePicker } from 'react-file-picker';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { PanDialog, PanDialogActions } from "pankosmia-rcl";

function ImportBurrito({ open, closeFn, reposModCount, setReposModCount }) {

    const { i18nRef } = useContext(i18nContext);
    const [loading, setLoading] = useState(false);
    const [filePicked, setFilePicked] = useState(null);
    const isZip = filePicked?.name?.toLowerCase().endsWith('.zip');
    const theme = useTheme();
    const handleImport = async (file) => {
        const formData = new FormData();

        formData.append('file', file, "data.zip");

        const fileName = filePicked?.name?.replace(/\.[^/.]+$/, "");
        const response = await fetch(`/burrito/zipped/_local_/_sideloaded_/${encodeURIComponent(fileName)}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
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
        <PanDialog
            titleLabel={doI18n("pages:content:import_content", i18nRef.current)}
            isOpen={open}
            closeFn={() => { setFilePicked(null); closeFn() }}
            theme={theme}
        >
            <DialogContent sx={{ mt: 1 }}>
                <FilePicker
                    extensions={['zip']}
                    onChange={(file) => { setFilePicked(file) }}
                    onError={error => { enqueueSnackbar(`${error}`, { variant: "error", }); setLoading(false); }}
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
            <Tooltip
                open={!isZip && filePicked}
                title={doI18n("pages:content:file_invalid", i18nRef.current)}
                placement="top-end"
            >
                <PanDialogActions
                    actionFn={() => { handleImport(filePicked); closeFn(); setTimeout(() => setFilePicked(null), 1500); }}
                    isDisabled={!filePicked || !isZip}
                    actionLabel={doI18n("pages:content:create", i18nRef.current)}
                    closeFn={() => { closeFn(); setFilePicked(null) }}
                    closeLabel={doI18n("pages:content:cancel", i18nRef.current)}
                />
            </Tooltip>
        </PanDialog>
    );
}

export default ImportBurrito;