import {useContext} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function RestoreContent({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

    const restoreRepo = async repo_path => {

        const restoreUrl = `/git/copy/${repo_path}?target_path=git.door43.org/BurritoTruck/${repo_path.split("/")[2]}&delete_src`;
        const restoreResponse = await postEmptyJson(restoreUrl, debugRef.current);
        if (restoreResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_restored", i18nRef.current),
                {variant: "success"}
            );

            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_restore_repo", i18nRef.current),
                {variant: "error"}
            );
        }
    }

    console.log(repoInfo);

    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle><b>{doI18n("pages:content:restore_content", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography>
                    {doI18n("pages:content:about_to_restore_content", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                color="warning"
                onClick={async () => {
                    await restoreRepo(repoInfo.path);
                    closeFn();
                }}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default RestoreContent;