import {useState, useContext} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    TextField,
    Stack
} from "@mui/material";
import {debugContext, i18nContext, doI18n, postEmptyJson, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function RemoteContent({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [remoteNameValue, setRemoteNameValue] = useState('');
    const [remoteNameIsValid, setRemoteNameIsValid] = useState(true);
    const remoteNameRegex = new RegExp("^[A-Za-z0-9_-]+$");

    const [remoteUrlValue, setRemoteUrlValue] = useState('');
    const [remoteUrlIsValid, setRemoteUrlIsValid] = useState(true);
    const remoteUrlRegex = new RegExp("^[A-Za-z0-9_:.@/-]+$");

    const [valueIsRepeated, setValueIsRepeated] = useState(false);

    const addRemoteRepo = async repo_path => {

        const remoteListUrl = `/git/remotes/${repo_path}`;
        const remoteList = await getJson(remoteListUrl, debugRef.current);
        const filteredList = remoteList.json.payload.remotes.filter((p) => p.name === "origin");

        console.log(filteredList[0]);

        if (filteredList[0].url === remoteUrlValue){
            setValueIsRepeated(true);
        }

        if (remoteList.json.is_good){
            if (filteredList.length > 0) {
                const deleteUrl = `/git/remote/delete/${repo_path}?remote_name=origin`;
                const deleteResponse = await postEmptyJson(deleteUrl, debugRef.current);
                if (deleteResponse.ok) {
                    console.log("se borró correctamente")
                } else {
                    console.error("no se pudo borrar")
                }
            }
        }

        const addUrl = `/git/remote/add/${repo_path}?remote_name=origin&remote_url=${remoteUrlValue}`;
        const addResponse = await postEmptyJson(addUrl, debugRef.current);
        if (addResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:remote_repo_added", i18nRef.current),
                {variant: "success"}
            );
            setReposModCount(reposModCount + 1);
            console.log(addResponse.json)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_add_remote_repo", i18nRef.current),
                {variant: "error"}
            );
        }
    }

    const handleRemoteNameValidation = (e) => {
        setRemoteNameIsValid(remoteNameRegex.test(e.target.value));
        setRemoteNameValue(e.target.value);
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
        <DialogTitle><b>{doI18n("pages:content:remote_content", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Stack spacing={2} sx={{ m: 2 }}>
                    <TextField
                        id="remote-name"
                        label={doI18n("pages:content:remote_name", i18nRef.current)}
                        value={remoteNameValue}
                        variant="outlined"
                        onChange={(e) => handleRemoteNameValidation(e)}
                        error={!remoteNameIsValid}
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
                disabled={!remoteNameIsValid || !remoteUrlIsValid || valueIsRepeated}
                onClick={async () => {
                            await addRemoteRepo(repoInfo.path);
                            closeFn()
                        }}
            >
                {doI18n("pages:content:update", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default RemoteContent;