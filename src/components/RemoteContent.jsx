import { useState, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    TextField,
    Stack,
    AppBar,
    Toolbar
} from "@mui/material";
import { debugContext, i18nContext, doI18n, postEmptyJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function RemoteContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    //const {debugRef} = useContext(debugContext);
    const [remoteOriginValue, setRemoteOriginValue] = useState('');
    const [remoteOriginIsValid, setRemoteOriginIsValid] = useState(true);
    const remoteOriginRegex = new RegExp("[a-zA-Z0-9/\-_]");

    const [remoteUrlValue, setRemoteUrlValue] = useState('');
    const [remoteUrlIsValid, setRemoteUrlIsValid] = useState(true);
    const remoteUrlRegex = new RegExp("/^\S+@\S+:@\S+$/");

    // BUENO LA UI PARECE ESTAR FUNCIONANDO FINO PERO EL REGEX COMO QUE NO SIRVE. Y NO SE COMO ES ESO DEL JSON.

    /* 
    const copyRepo = async repo_path => {

        const copyUrl = `/git/copy/${repo_path}?target_path=_local_/_local_/${repo_path.split("/")[2]}`;
        const copyResponse = await postEmptyJson(copyUrl, debugRef.current);
        if (copyResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_copied", i18nRef.current),
                {variant: "success"}
            );
            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_copy_repo", i18nRef.current),
                {variant: "error"}
            );
        }
    }
    */

    const handleRemoteOriginValidation = (e) => {
        setRemoteOriginIsValid(remoteOriginRegex.test(e.target.value));
        setRemoteOriginValue(e.target.value);
    };

    const handleRemoteUrlValidation = (e) => {
        setRemoteUrlIsValid(remoteUrlRegex.test(e.target.value));
        setRemoteUrlValue(e.target.value);
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
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:remote_content", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography variant='subtitle2' sx={{ ml: 1, p: 1 }}> {doI18n(`pages:content:required_field`, i18nRef.current)}</Typography>
                <Stack spacing={2} sx={{ m: 2 }}>
                    <TextField
                        id="remote-origin"
                        label={doI18n("pages:content:remote_origin", i18nRef.current)}
                        value={remoteOriginValue}
                        variant="outlined"
                        onChange={(e) => handleRemoteOriginValidation(e)}
                        error={!remoteOriginIsValid}
                        required={true}
                    />
                    <TextField
                        id="repo-url"
                        label={doI18n("pages:content:remote_repo_url", i18nRef.current)}
                        value={remoteUrlValue}
                        variant="outlined"
                        onChange={(e) => handleRemoteUrlValidation(e)}
                        error={!remoteUrlIsValid}
                        required={true}
                    />
                </Stack>
                <Typography>
                    {doI18n("pages:content:about_to_upload_content", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                color="warning"
                onClick={/* async () => {
                    await copyRepo(repoInfo.path);
                    closeFn();
                } */() => {
                        (remoteOriginIsValid && remoteUrlIsValid)
                            ? console.log(remoteOriginValue, remoteUrlValue)
                            : console.error("Valores incorrectos");
                        closeFn()
                    }
                }
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default RemoteContent;