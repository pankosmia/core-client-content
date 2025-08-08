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

function CopyContent({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

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

    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle><b>{doI18n("pages:content:copy_content", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography>
                    {doI18n("pages:content:about_to_copy_content", i18nRef.current)}
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
                    await copyRepo(repoInfo.path);
                    closeFn();
                }}
            >{doI18n("pages:content:do_copy_button", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default CopyContent;