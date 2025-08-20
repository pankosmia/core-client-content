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
import { debugContext, i18nContext, doI18n, getJson, postJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function AddAndCommit({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
    const [commitMessage, setCommitMessage] = useState('');

    const addAndCommitRepo = async (repo_path, commitMessage) => {

        const repoStatusUrl = `/git/status/${repo_path}`;
        const repoStatusResponse = await getJson(repoStatusUrl, debugRef.current);
        if (repoStatusResponse.ok) {
            if (repoStatusResponse.json.length > 0) {
                const postCommit = async () => {
                    const addAndCommitUrl = `/git/add-and-commit/${repo_path}`;
                    const commitJson = {"commit_message": commitMessage};
                    const addAndCommitResponse = await postJson(addAndCommitUrl, commitJson, debugRef.current);
                    if (addAndCommitResponse.ok) {
                        enqueueSnackbar(
                            doI18n("pages:content:commit_complete", i18nRef.current),
                            { variant: "success" }
                        );
                    } else {
                        enqueueSnackbar(
                            doI18n("pages:content:could_not_commit", i18nRef.current),
                            { variant: "error" }
                        );
                    }
                }
                postCommit().then()
            }
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_commits", i18nRef.current),
                { variant: "error" }
            );
        }
    }

    const handleCommitMessage = (e) => {
        setCommitMessage(e.target.value);
    };

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
                    {doI18n("pages:content:commits", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
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
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                color="warning"
                disabled={commitMessage === ''}
                onClick={() => { addAndCommitRepo(repoInfo.path, commitMessage).then() ;closeFn() }}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default AddAndCommit;