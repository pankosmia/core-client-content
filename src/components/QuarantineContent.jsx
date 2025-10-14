import { useContext } from 'react';
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
import { debugContext, i18nContext, doI18n, postEmptyJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function QuarantineContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);

    const quarantineRepo = async repo_path => {

        const quarantineUrl = `/git/copy/${repo_path}?target_path=_local_/_quarantine_/${repo_path.split("/")[2]}&delete_src`;
        const quarantineResponse = await postEmptyJson(quarantineUrl, debugRef.current);
        if (quarantineResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_quarantined", i18nRef.current),
                { variant: "success" }
            );
            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_quarantine_repo", i18nRef.current),
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
        sx={{    
            backdropFilter: "blur(3px)",
        }}
    >
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:quarantine_content", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Typography>
                    {doI18n("pages:content:about_to_quarantine_content", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                variant='contained'
                color="primary"
                onClick={async () => {
                    await quarantineRepo(repoInfo.path);
                    closeFn();
                }}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default QuarantineContent;