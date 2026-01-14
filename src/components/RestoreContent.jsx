import { useContext } from 'react';
import { DialogContent, DialogContentText, Typography } from '@mui/material';
import { debugContext, i18nContext, doI18n, postEmptyJson } from 'pithekos-lib';
import { enqueueSnackbar } from 'notistack';
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';
function RestoreContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);

  const restoreRepo = async (repo_path) => {
    const restoreUrl = `/git/copy/${repo_path}?target_path=_local_/_local_/${repo_path.split('/')[2]}&delete_src`;
    const restoreResponse = await postEmptyJson(restoreUrl, debugRef.current);
    if (restoreResponse.ok) {
      enqueueSnackbar(doI18n('pages:content:repo_restored', i18nRef.current), {
        variant: 'success',
      });
      setReposModCount(reposModCount + 1);
    } else {
      enqueueSnackbar(doI18n('pages:content:could_not_restore_repo', i18nRef.current), {
        variant: 'error',
      });
    }
  };

  return (
    <PanDialog
      titleLabel={doI18n('pages:content:restore_content', i18nRef.current)}
      isOpen={open}
      closeFn={() => closeFn()}
    >
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6">{repoInfo.name}</Typography>
          <Typography>
            {doI18n('pages:content:about_to_restore_content', i18nRef.current)}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <PanDialogActions
        actionFn={async () => {
          await restoreRepo(repoInfo.path);
          closeFn();
        }}
        actionLabel={doI18n('pages:content:accept', i18nRef.current)}
        closeFn={() => closeFn()}
        closeLabel={doI18n('pages:content:cancel', i18nRef.current)}
      />
    </PanDialog>
  );
}

export default RestoreContent;
