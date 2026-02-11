import { useContext, useCallback } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { enqueueSnackbar } from 'notistack';
import { i18nContext, doI18n, debugContext, postEmptyJson, netContext } from 'pithekos-lib';

function Notification({ remoteRepoPath, params, isDownloading, setIsDownloading, remoteSource }) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const { enabledRef } = useContext(netContext);

  const handleDownloadClick = useCallback(
    async (params, remoteRepoPath, postType) => {
      setIsDownloading((isDownloadingCurrent) => ({
        ...isDownloadingCurrent,
        [remoteRepoPath]: 'downloading',
      }));
      enqueueSnackbar(
        `${doI18n('pages:core-remote-resources:downloading', i18nRef.current)} ${params.row.abbreviation}`,
        { variant: 'info' }
      );
      const fetchUrl =
        postType === 'clone'
          ? `/git/clone-repo/${remoteRepoPath}`
          : `/git/pull-repo/origin/${remoteRepoPath}`;
      const fetchResponse = await postEmptyJson(fetchUrl, debugRef.current);
      if (fetchResponse.ok) {
        enqueueSnackbar(
          `${params.row.abbreviation} ${doI18n(postType === 'clone' ? 'pages:core-remote-resources:downloaded' : 'pages:core-remote-resources:updated', i18nRef.current)}`,
          { variant: 'success' }
        );
        setIsDownloading((isDownloadingCurrent) => ({
          ...isDownloadingCurrent,
          [remoteRepoPath]: 'downloaded',
        }));
      } else {
        enqueueSnackbar(
          `${params.row.abbreviation} ${doI18n('pages:core-remote-resources:failed', i18nRef.current)} : ${fetchResponse.error} (${fetchResponse.status})`,
          { variant: 'error' }
        );
        setIsDownloading((isDownloadingCurrent) => ({
          ...isDownloadingCurrent,
          [remoteRepoPath]: 'notDownloaded',
        }));
      }
    },
    [remoteSource]
  );

  return (
    <>
      {enabledRef.current &&
        isDownloading &&
        (isDownloading[remoteRepoPath] === 'updatable' ||
          isDownloading[remoteRepoPath] === 'downloading') && (
          <IconButton disableRipple={isDownloading[remoteRepoPath] === 'downloading'}>
            {isDownloading[remoteRepoPath] === 'updatable' && (
              <SyncOutlinedIcon
                onClick={(event) => {
                  handleDownloadClick(params, remoteRepoPath, 'fetch');
                  event.stopPropagation();
                }}
              />
            )}
            {isDownloading[remoteRepoPath] === 'downloading' && (
              <CircularProgress size="30px" color="secondary" />
            )}
          </IconButton>
        )}
    </>
  );
}

export default Notification;
