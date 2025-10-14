
import {useContext} from 'react';
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
import {debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function DeleteContent({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

    const deleteRepo = async repo_path => {

        const deleteUrl = `/git/delete/${repo_path}`;
        const deleteResponse = await postEmptyJson(deleteUrl, debugRef.current);
        if (deleteResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_deleted", i18nRef.current),
                {variant: "success"}
            );
            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_delete_repo", i18nRef.current),
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
        sx={{    
            backdropFilter: "blur(3px)",
        }}
    >
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                   {doI18n("pages:content:delete_content", i18nRef.current)}
                </Typography>

            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography>
                    {doI18n("pages:content:about_to_delete_content", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
             variant='contained'
                color="primary"
                onClick={async () => {
                    await deleteRepo(repoInfo.path);
                    closeFn();
                }}
            >{doI18n("pages:content:do_delete_button", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default DeleteContent;