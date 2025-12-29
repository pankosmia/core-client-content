
import { useContext } from 'react';
import {
    DialogContent,
    DialogContentText,
    Typography
} from "@mui/material";
import { debugContext, i18nContext, doI18n, postEmptyJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';
function DeleteContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);

    const deleteRepo = async repo_path => {

        const deleteUrl = `/git/delete/${repo_path}`;
        const deleteResponse = await postEmptyJson(deleteUrl, debugRef.current);
        if (deleteResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:repo_deleted", i18nRef.current),
                { variant: "success" }
            );
            setReposModCount(reposModCount + 1)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_delete_repo", i18nRef.current),
                { variant: "error" }
            );
        }
    }

    return (
        <PanDialog
            titleLabel={doI18n("pages:content:delete_content", i18nRef.current)}
            isOpen={open}
            closeFn={() => closeFn()}
        >
            <DialogContent>
                <DialogContentText>
                    <Typography variant="h6">
                        {repoInfo.name}
                    </Typography>
                    <Typography>
                        {doI18n("pages:content:delete_content", i18nRef.current)}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <PanDialogActions
                actionFn={async () => {
                    await deleteRepo(repoInfo.path);
                    closeFn();
                }}
                actionLabel={doI18n("pages:content:do_delete_button", i18nRef.current)}
                closeFn={() => closeFn()}
                closeLabel={doI18n("pages:content:cancel", i18nRef.current)}
            />
        </PanDialog>
    );
}

export default DeleteContent;