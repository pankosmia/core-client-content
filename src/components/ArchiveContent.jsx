import { useContext } from 'react';
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Toolbar,
    Typography
} from "@mui/material";
import { debugContext, i18nContext, doI18n, postEmptyJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function ArchiveContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);

    const archiveRepo = async repo_path => {

        const archiveUrl = `/git/copy/${repo_path}?target_path=_local_/_archive_/${repo_path.split("/")[2]}&delete_src`;
        const archiveResponse = await postEmptyJson(archiveUrl, debugRef.current);
        if (archiveResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_archived", i18nRef.current),
                { variant: "success" }
            );

            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_archive_repo", i18nRef.current),
                { variant: "error" }
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
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:archive_content", i18nRef.current)}
                </Typography>

            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography>
                    {doI18n("pages:content:about_to_archive_content", i18nRef.current)}
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
                    await archiveRepo(repoInfo.path);
                    closeFn();
                }}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default ArchiveContent;