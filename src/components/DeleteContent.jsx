import {useRef, useContext, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    OutlinedInput,
    Typography
} from "@mui/material";
import {getText, debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import {saveAs} from 'file-saver';

function DeleteContent({repoInfo, open, closeFn}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

    const deleteRepo = async repo_path => {
        const deleteUrl = `/git/delete-repo/${repo_path}`;
        const deleteResponse = postEmptyJson(deleteUrl, debugRef.current);
        if (deleteResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_deleted", i18nRef.current),
                {variant: "success"}
            );
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
    >
        <DialogTitle><b>{doI18n("pages:content:delete_content", i18nRef.current)}</b></DialogTitle>
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
                variant="warning"
                onClick={() => {
                    deleteRepo(repoInfo);
                    closeFn();
                }}
            >{doI18n("pages:content:do_delete_button", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default DeleteContent;