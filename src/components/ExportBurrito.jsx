import { useContext } from 'react';
import { DialogContent, DialogContentText, Typography, useTheme } from '@mui/material';
import { i18nContext, doI18n } from 'pithekos-lib';
import { enqueueSnackbar } from 'notistack';
import { PanDialog, PanDialogActions } from 'pankosmia-rcl';
import { saveAs } from 'file-saver';

function ExportBurrito({ repoInfo, open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const theme = useTheme();

  const exportBurrito = async (repo_path) => {
    const exportUrl = `/burrito/zipped/${repo_path}`;
    const exportResponse = await fetch(exportUrl);
    if (exportResponse.ok) {
      let blob = await exportResponse.blob();
      saveAs(blob, `${repoInfo.abbreviation}.zip`);
      enqueueSnackbar(doI18n('pages:content:burrito_exported', i18nRef.current), {
        variant: 'success',
      });
      setReposModCount(reposModCount + 1);
    } else {
      enqueueSnackbar(doI18n('pages:content:could_not_export_burrito', i18nRef.current), {
        variant: 'error',
      });
    }
  };

  return (
    <PanDialog
      titleLabel={doI18n('pages:content:export_burrito', i18nRef.current)}
      isOpen={open}
      closeFn={() => closeFn()}
      theme={theme}
    >
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6">{repoInfo.name}</Typography>
          <Typography>
            {doI18n('pages:content:about_to_export_burrito', i18nRef.current)}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <PanDialogActions
        actionFn={async () => {
          await exportBurrito(repoInfo.path);
          closeFn();
        }}
        actionLabel={doI18n('pages:content:do_export', i18nRef.current)}
        closeFn={() => closeFn()}
        closeLabel={doI18n('pages:content:cancel', i18nRef.current)}
      />
    </PanDialog>
  );
}
export default ExportBurrito;
