import { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Toolbar,
    Typography,
    Stack,
    TextField
} from "@mui/material";
import { debugContext, i18nContext, doI18n, postJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function PushToDcs({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
/*     const [commitMessage, setCommitMessage] = useState('');
    const [commitsArray, setCommitsArray] = useState([]); */

/*     const repoStatus = async repo_path => {

        const repoStatusUrl = `/git/status/${repo_path}`;
        const repoStatusResponse = await getJson(repoStatusUrl, debugRef.current);
        if (repoStatusResponse.ok) {
            setCommitsArray(repoStatusResponse.json)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_commits", i18nRef.current),
                { variant: "error" }
            );
        }
    }; */

   /*  useEffect(() => {
        if (open === true) {
            repoStatus(repoInfo.path).then()
        }
    },[open]); */

    const pushRepo = async (repo_path) => {

        const pushUrl = `/git/push/${repo_path}`;
            const pushJson = JSON.stringify({
                "cred_type": "ed25519",
                "pass_key": "elias",
                "remote": "origin"
            });
            const pushResponse = await postJson(pushUrl, pushJson, debugRef.current);
            if (pushResponse.ok) {
                enqueueSnackbar(
                    doI18n("pages:content:commit_complete", i18nRef.current),
                    { variant: "success" }
                );
                setReposModCount(reposModCount + 1)
            } else {
                enqueueSnackbar(
                    doI18n("pages:content:could_not_commit", i18nRef.current),
                    { variant: "error" }
                );
            }
    };

/*     const handleCommitMessage = (e) => {
        setCommitMessage(e.target.value);
    }; */

    return <Dialog
        open={open}
        onClose={closeFn}
        fullWidth={true}
        maxWidth={"lg"}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:push_to_dcs", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
           {/*  <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Stack spacing={2} sx={{ m: 2 }}>
                    <TextField
                        id="commit-message"
                        label={doI18n("pages:content:commit_message", i18nRef.current)}
                        value={commitMessage}
                        variant="outlined"
                        onChange={(e) => handleCommitMessage(e)}
                        required={true}
                    />
                </Stack>
                <Typography>
                    {doI18n("pages:content:about_to_commit_content", i18nRef.current)}
                </Typography>
            </DialogContentText> */}
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                color="warning"
                disabled={false}
                onClick={() => { pushRepo(repoInfo.path).then() ;closeFn() }}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PushToDcs;