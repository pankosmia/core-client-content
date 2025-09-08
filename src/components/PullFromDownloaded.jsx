import {useContext} from 'react';
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Toolbar,
    Typography
} from "@mui/material";
import {debugContext, i18nContext, doI18n, postEmptyJson, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function PullFromDownloaded({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

    const deleteUpdate = async repoPath => {
        const deleteUpdateUrl = `/git/delete/${repoPath}`;
        const deleteUpdateResponse = await postEmptyJson(deleteUpdateUrl, debugRef.current);
        if (!deleteUpdateResponse) {
            enqueueSnackbar(
                doI18n("pages:content:could_not_delete_update", i18nRef.current),
                {variant: "error"}
            );
        }
    }

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
        <AppBar color='secondary' sx={{position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4}}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:pull_from_downloaded", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="warning" onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant='contained'
                color="primary"
                onClick={
                    async () => {
                        // Get downloaded from the remotes for local
                        const remoteListUrl = `/git/remotes/${repoInfo.path}`;
                        const remoteList = await getJson(remoteListUrl, debugRef.current);
                        if (!remoteList.ok) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_list_remotes", i18nRef.current),
                                {variant: "error"}
                            );
                            closeFn();
                            return;
                        }
                        const downloadRemote = remoteList.json.payload.remotes.filter(i => i.name === "downloaded")[0];
                        if (!downloadRemote) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_find_downloaded_remote", i18nRef.current),
                                {variant: "error"}
                            );
                            closeFn();
                            return;
                        }
                        const downloadRepoUri = downloadRemote.url;
                        const downloadRepoPath = downloadRepoUri
                            .replace("file://", "")
                            .split("/")
                            .reverse()
                            .slice(0,3)
                            .reverse()
                            .join("/");

                        // Copy downloaded to updated
                        const updateRepoPath = `_local_/_updates_/${repoInfo.path.split("/")[2]}`;
                        const copyUrl = `/git/copy/${downloadRepoPath}?target_path=${updateRepoPath}`;
                        const copyResponse = await postEmptyJson(copyUrl, debugRef.current);
                        if (!copyResponse.ok) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_copy_repo_to_updates", i18nRef.current),
                                {variant: "error"}
                            );
                            closeFn();
                            return;
                        }

                        // Set editable remote for updated repo which is copy of downloaded
                        const addEditableUrl = `/git/remote/add/${updateRepoPath}?remote_name=editable&remote_url=${repoInfo.path}`;
                        const addEditableResponse = await postEmptyJson(addEditableUrl, debugRef.current);
                        if (!addEditableResponse.ok) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_add_local_remote_to_updated", i18nRef.current),
                                {variant: "error"}
                            );
                            closeFn();
                            return;
                        }

                        // Attempt pull from editable to updated
                        // If fail, delete updated and croak
                        const pull1Url = `/git/pull-repo/editable/${updateRepoPath}`;
                        const pull1Response = await postEmptyJson(pull1Url, debugRef.current);
                        if (!pull1Response.ok) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_pull_to_update", i18nRef.current),
                                {variant: "error"}
                            );
                            await deleteUpdate(updateRepoPath);
                            closeFn();
                            return;
                        }

                        // Check for conflicts
                        if (pull1Response["has_conflicts"]) {
                            enqueueSnackbar(
                                doI18n("pages:content:merge conflicts", i18nRef.current),
                                {variant: "error"}
                            );
                            await deleteUpdate(updateRepoPath);
                            closeFn();
                            return;
                        }

                        // Pull from updated to local
                        const pull2Url = `/git/pull-repo/updates/${repoInfo.path}`;
                        const pull2Response = await postEmptyJson(pull2Url, debugRef.current);
                        if (!pull2Response.ok) {
                            enqueueSnackbar(
                                doI18n("pages:content:could_not_pull_to_local", i18nRef.current),
                                {variant: "error"}
                            );
                        }

                        // Delete updated regardless
                        await deleteUpdate(updateRepoPath);

                        // The end!
                        enqueueSnackbar(
                            doI18n("pages:content:pulled", i18nRef.current),
                            { variant: "success" }
                        );
                        closeFn();
                    }
                }
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PullFromDownloaded;