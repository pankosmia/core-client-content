import { useContext } from 'react';
import { DialogContent, DialogContentText, Typography, useTheme } from '@mui/material';
import { doI18n, postEmptyJson } from 'pithekos-lib';
import {i18nContext,debugContext} from "pankosmia-rcl";
import { enqueueSnackbar } from 'notistack';
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';

function QuarantineContent({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const theme = useTheme();

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
      titleLabel={doI18n('pages:content:quarantine_content', i18nRef.current)}
      isOpen={open}
      closeFn={() => closeFn()}
      theme={theme}
    >
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6">{repoInfo.name}</Typography>
          <Typography>
            {doI18n('pages:content:about_to_quarantine_content', i18nRef.current)}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <PanDialogActions
        actionFn={async () => {
          await quarantineRepo(repoInfo.path);
          closeFn();
        }}
        actionLabel={doI18n('pages:content:quarantine_content', i18nRef.current)}
        closeFn={() => closeFn()}
        closeLabel={doI18n('pages:content:cancel', i18nRef.current)}
      />
    </PanDialog>
  );
}

export default QuarantineContent;
