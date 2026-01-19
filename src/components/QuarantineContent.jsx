import { useContext } from 'react';
import { DialogContent, DialogContentText, Typography } from '@mui/material';
import { debugContext, i18nContext, doI18n, postEmptyJson } from 'pithekos-lib';
import { enqueueSnackbar } from 'notistack';
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';

function QuarantineContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);

  const quarantineRepo = async (repo_path) => {
    const quarantineUrl = `/git/copy/${repo_path}?target_path=_local_/_quarantine_/${repo_path.split('/')[2]}&delete_src`;
    const quarantineResponse = await postEmptyJson(quarantineUrl, debugRef.current);
    if (quarantineResponse.ok) {
      enqueueSnackbar(doI18n('pages:content:repo_quarantined', i18nRef.current), {
        variant: 'success',
      });
      setReposModCount(reposModCount + 1);
    } else {
      enqueueSnackbar(doI18n('pages:content:could_not_quarantine_repo', i18nRef.current), {
        variant: 'error',
      });
    }
  };

  return (
    <PanDialog
      titleLabel={`${doI18n('pages:content:quarantine_content', i18nRef.current)} - ${repoInfo.name}`}
      isOpen={open}
      closeFn={() => closeFn()}
    >
      <DialogContent>
        <DialogContentText>
            {doI18n('pages:content:about_to_quarantine_content', i18nRef.current)}
        </DialogContentText>
      </DialogContent>
      <PanDialogActions
        actionFn={async () => {
          await quarantineRepo(repoInfo.path);
          closeFn();
        }}
        actionLabel={doI18n('pages:content:accept', i18nRef.current)}
        closeFn={() => closeFn()}
        closeLabel={doI18n('pages:content:cancel', i18nRef.current)}
      />
    </PanDialog>
  );
}

export default QuarantineContent;
