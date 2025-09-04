import {useState, useContext} from 'react';
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
import {debugContext, i18nContext, doI18n, postJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function PullFromDownloaded({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

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
                    () => {
                        // Copy local to updated
                        // Set local remote for updated
                        // Attempt pull from downloaded to updated
                        // If fail, delete updated and croak
                        // Add updated remote for local
                        // Pull from updated to remote
                        // Remove remote for updated
                        // Delete updated
                        closeFn()
                    }
                }
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PullFromDownloaded;