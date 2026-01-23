import { useContext } from 'react';
import { DialogContent, DialogContentText, Typography, useTheme } from '@mui/material';
import { debugContext, i18nContext, doI18n, postEmptyJson } from 'pithekos-lib';
import { enqueueSnackbar } from 'notistack';
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';

function CopyContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const theme = useTheme();
  
  const copyRepo = async (repo_path) => {
    const copyRepoPath = `_local_/_local_/${repo_path.split('/')[2]}`;
    const copyUrl = `/git/copy/${repo_path}?target_path=${copyRepoPath}&add_ignore`;
    const copyResponse = await postEmptyJson(copyUrl, debugRef.current);
    if (copyResponse.ok) {
      // Set up remote for copy (pulls from downloaded) - assume there's no 'downloaded' remote
      const addUrl = `/git/remote/add/${copyRepoPath}?remote_name=downloaded&remote_url=${repo_path}`;
      const addResponse = await postEmptyJson(addUrl, debugRef.current);
      if (!addResponse.ok) {
        enqueueSnackbar(doI18n('pages:content:could_not_add_remote_repo', i18nRef.current), {
          variant: 'error',
        });
        return;
      }
      const updatesPath = `_local_/_updates_/${repo_path.split('/')[2]}`;
      const addUrl2 = `/git/remote/add/${copyRepoPath}?remote_name=updates&remote_url=${updatesPath}`;
      const addResponse2 = await postEmptyJson(addUrl2, debugRef.current);
      if (!addResponse2.ok) {
        enqueueSnackbar(doI18n('pages:content:could_not_add_remote_repo', i18nRef.current) + '2', {
          variant: 'error',
        });
        return;
      }
      // Done!
      enqueueSnackbar(doI18n('pages:content:repo_copied', i18nRef.current), { variant: 'success' });
      setReposModCount(reposModCount + 1);
    } else {
      enqueueSnackbar(doI18n('pages:content:could_not_copy_repo', i18nRef.current), {
        variant: 'error',
      });
    }
  };

  return (
    <PanDialog
      titleLabel={`${doI18n('pages:content:copy_content', i18nRef.current)} - ${repoInfo.abbreviation}`}
      isOpen={open}
      closeFn={() => closeFn()}
      theme={theme}
      fullWidth={false}
    >
      <DialogContent>
        <DialogContentText>
          {doI18n('pages:content:about_to_copy_content', i18nRef.current)}
        </DialogContentText>
      </DialogContent>
      <PanDialogActions
        actionFn={async () => {
          await copyRepo(repoInfo.path);
          closeFn();
        }}
        actionLabel={doI18n('pages:content:do_copy_button', i18nRef.current)}
        closeFn={() => closeFn()}
        closeLabel={doI18n('pages:content:cancel', i18nRef.current)}
      />
    </PanDialog>
  );
}
export default CopyContent;
