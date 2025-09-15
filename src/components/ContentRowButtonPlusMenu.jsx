import {IconButton, Menu, MenuItem, Divider, ListItemText, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {i18nContext, doI18n, getJson, debugContext, netContext} from "pithekos-lib";
import UsfmExport from "./UsfmExport";
import ZipExport from "./ZipExport";
import PdfGenerate from "./PdfGenerate";
import CopyContent from "./CopyContent";
import RemoteContent from "./RemoteContent";
import ArchiveContent from "./ArchiveContent";
import QuarantineContent from "./QuarantineContent";
import Commits from "./Commits";
import AddAndCommit from "./AddAndCommit";
import PushToDcs from "./PushToDcs";
import RestoreContent from "./RestoreContent";
import DeleteContent from "./DeleteContent";
import VersionManager from "./VersionManager";
import NewTextTranslationBook from "./NewTextTranslationBook";
import {useState, useContext, useEffect} from "react";
import { enqueueSnackbar } from "notistack";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import PullFromDownloaded from "./PullFromDownloaded";

function ContentRowButtonPlusMenu({repoInfo, reposModCount, setReposModCount, isNormal}) {

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const {enabledRef} = useContext(netContext);

    const [usfmExportAnchorEl, setUsfmExportAnchorEl] = useState(null);
    const usfmExportOpen = Boolean(usfmExportAnchorEl);

    const [zipExportAnchorEl, setZipExportAnchorEl] = useState(null);
    const zipExportOpen = Boolean(zipExportAnchorEl);

    const [pdfGenerateAnchorEl, setPdfGenerateAnchorEl] = useState(null);
    const pdfGenerateOpen = Boolean(pdfGenerateAnchorEl);

    const [contentRowAnchorEl, setContentRowAnchorEl] = useState(null);
    const contentRowOpen = Boolean(contentRowAnchorEl);

    const [copyContentAnchorEl, setCopyContentAnchorEl] = useState(null);
    const copyContentOpen = Boolean(copyContentAnchorEl);

    const [remoteContentAnchorEl, setRemoteContentAnchorEl] = useState(null);
    const remoteContentOpen = Boolean(remoteContentAnchorEl);

    const [archiveContentAnchorEl, setArchiveContentAnchorEl] = useState(null);
    const archiveContentOpen = Boolean(archiveContentAnchorEl);

    const [quarantineContentAnchorEl, setQuarantineContentAnchorEl] = useState(null);
    const quarantineContentOpen = Boolean(quarantineContentAnchorEl);

    const [commitsAnchorEl, setCommitsAnchorEl] = useState(null);
    const commitsOpen = Boolean(commitsAnchorEl);

    const [addAndCommitAnchorEl, setAddAndCommitAnchorEl] = useState(null);
    const addAndCommitOpen = Boolean(addAndCommitAnchorEl);

    const [pushAnchorEl, setPushAnchorEl] = useState(null);
    const pushOpen = Boolean(pushAnchorEl);

    const [pullAnchorEl, setPullAnchorEl] = useState(null);
    const pullOpen = Boolean(pullAnchorEl);

    const [restoreContentAnchorEl, setRestoreContentAnchorEl] = useState(null);
    const restoreContentOpen = Boolean(restoreContentAnchorEl);

    const [deleteContentAnchorEl, setDeleteContentAnchorEl] = useState(null);
    const deleteContentOpen = Boolean(deleteContentAnchorEl);

    const [versionManagerAnchorEl, setVersionManagerAnchorEl] = useState(null);
    const versionManagerOpen = Boolean(versionManagerAnchorEl);

    const [newBookAnchorEl, setNewBookAnchorEl] = useState(null);
    const newBookOpen = Boolean(newBookAnchorEl);

    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

    const [status, setStatus] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [remoteUrl, setRemoteUrl] = useState('');

    const handleSubMenuClick = (event) => {
      setSubMenuAnchorEl(event.currentTarget);
    };

    const repoStatus = async repo_path => {

        const statusUrl = `/git/status/${repo_path}`;
        const statusResponse = await getJson(statusUrl, debugRef.current);
        if (statusResponse.ok) {
            setStatus(statusResponse.json);
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_commits", i18nRef.current),
                { variant: "error" }
            );
        }
    };

    const repoRemotes = async repo_path => { 
        const remoteListUrl = `/git/remotes/${repo_path}`;
        const remoteList = await getJson(remoteListUrl, debugRef.current);
        if (remoteList.ok) {
            setRemotes(remoteList.json.payload.remotes);
            const originRecord = remoteList.json.payload.remotes.filter((p) => p.name === "origin")[0];
            if (originRecord) {
                setRemoteUrl(originRecord.url)
            }
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_list_remotes", i18nRef.current),
                {variant: "error"}
            )
        }
    };

    useEffect(() => {
        if (contentRowOpen) {
            repoStatus(repoInfo.path).then();
            repoRemotes(repoInfo.path).then();
        }
    },
    [contentRowOpen]);

    return <>
        <IconButton
            onClick={(event) => {
                setContentRowAnchorEl(event.currentTarget);
            }}
        >
            <MoreVertIcon/>
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={contentRowAnchorEl}
            open={contentRowOpen}
            onClose={() => {
                setContentRowAnchorEl(null);
            }}
            slotProps={{list: {'aria-labelledby': 'basic-button',}}}
        >
            {
            isNormal ? 
                <>
                    <MenuItem
                        disabled={repoInfo.flavor !== "textTranslation"}
                        onClick={handleSubMenuClick}
                    >
                        <ListItemText>
                          {doI18n("pages:content:export", i18nRef.current)}
                        </ListItemText>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <ArrowRightIcon />
                        </Typography>
                        
                    </MenuItem>
                    <Divider/>
                    <MenuItem
                        onClick={(event) => {
                            setVersionManagerAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={!repoInfo.path.split("/")[0] === "_local_" || repoInfo.path.split("/")[1] === "_updates_"}
                    >
                        {doI18n("pages:content:version_manager", i18nRef.current)}
                    </MenuItem>
                    <MenuItem
                        onClick={(event) => {
                            setNewBookAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={!["textTranslation"].includes(repoInfo.flavor)}
                    >
                        {doI18n("pages:content:new_book", i18nRef.current)}
                    </MenuItem>
                    <Divider/>
                    <MenuItem
                        onClick={(event) => {
                            setCopyContentAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={repoInfo.path.split("/")[0] === "_local_" || repoInfo.path.split("/")[1] === "_local_"}
                    >
                        {doI18n("pages:content:copy_content", i18nRef.current)}
                    </MenuItem>
                    {
                        (repoInfo.path.split("/")[0] === "_local_" && repoInfo.path.split("/")[1] !== "_updates_") && <MenuItem
                            onClick={(event) => {
                                setRemoteContentAnchorEl(event.currentTarget);
                                setContentRowAnchorEl(null);
                            }}
                        >
                            {doI18n("pages:content:remote_content", i18nRef.current)}
                        </MenuItem>
                    }
                    <MenuItem
                        onClick={(event) => {
                            setArchiveContentAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={repoInfo.path.split("/")[1] === "_archived_"}
                    >
                        {doI18n("pages:content:archive_content", i18nRef.current)}
                    </MenuItem>
                    <MenuItem
                        onClick={(event) => {
                            setQuarantineContentAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={repoInfo.path.split("/")[1] === "_quarantine_"}
                    >
                        {doI18n("pages:content:quarantine_content", i18nRef.current)}
                    </MenuItem>
                    {
                        repoInfo.path.includes("_local_/_local_") 
                        &&
                        <>
                            <MenuItem
                                onClick={(event) => {
                                    setCommitsAnchorEl(event.currentTarget);
                                    setContentRowAnchorEl(null);
                                }}
                            >
                                {doI18n("pages:content:commits", i18nRef.current)}
                            </MenuItem>
                            <MenuItem
                                onClick={(event) => {
                                    setAddAndCommitAnchorEl(event.currentTarget);
                                    setContentRowAnchorEl(null);
                                }}
                            >
                                {doI18n("pages:content:add_and_commit", i18nRef.current)}
                            </MenuItem>
                            <MenuItem
                                onClick={(event) => {
                                    setPushAnchorEl(event.currentTarget);
                                    setContentRowAnchorEl(null);
                                }}
                                disabled={!enabledRef.current || status.length > 0 || remotes.length === 0 || !remoteUrl.startsWith("https://")}
                            >
                                {doI18n("pages:content:push_to_dcs", i18nRef.current)}
                            </MenuItem>
                            <MenuItem
                                onClick={(event) => {
                                    setPullAnchorEl(event.currentTarget);
                                    setContentRowAnchorEl(null);
                                }}
                                disabled={status.length > 0}
                            >
                                {doI18n("pages:content:pull_from_downloaded", i18nRef.current)}
                            </MenuItem>
                        </>
                    }
                    <MenuItem
                        onClick={(event) => {
                            setDeleteContentAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                    >
                        {doI18n("pages:content:delete_content", i18nRef.current)}
                    </MenuItem>
                </>
            :
                <>
                    { !repoInfo.path.includes("_updates_") &&
                        <MenuItem
                            onClick={(event) => {
                                setRestoreContentAnchorEl(event.currentTarget);
                                setContentRowAnchorEl(null);
                            }}
                            disabled={["_local_", "BurritoTruck", "uW"].every(str => repoInfo.path.split("/")[1] === (str))}
                        >
                            {doI18n("pages:content:restore_content", i18nRef.current)}
                        </MenuItem>
                    }
                    <MenuItem
                        onClick={(event) => {
                            setDeleteContentAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                    >
                        {doI18n("pages:content:delete_content", i18nRef.current)}
                    </MenuItem>
                </>
            }
        </Menu>
        <Menu
            id="basic-sub-menu"
            anchorEl={subMenuAnchorEl}
            open={Boolean(subMenuAnchorEl)}
            onClose={() => {
                setContentRowAnchorEl(null);
                setSubMenuAnchorEl(null);
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'left'}}
            transformOrigin={{ vertical: 'top', horizontal: 'right'}}
            slotProps={{list: {'aria-labelledby': 'basic-button',}}}
        >
          <MenuItem
              onClick={(event) => {
                  setUsfmExportAnchorEl(event.currentTarget);
                  setContentRowAnchorEl(null);
                  setSubMenuAnchorEl(null);
              }}
              disabled={repoInfo.flavor !== "textTranslation"}
          >
              {doI18n("pages:content:export_usfm", i18nRef.current)}
          </MenuItem>
          <MenuItem
              onClick={(event) => {
                  setZipExportAnchorEl(event.currentTarget);
                  setContentRowAnchorEl(null);
                  setSubMenuAnchorEl(null);
              }}
              disabled={repoInfo.flavor !== "textTranslation"}
          >
              {doI18n("pages:content:export_zip", i18nRef.current)}
          </MenuItem>
          <MenuItem
              onClick={(event) => {
                  setPdfGenerateAnchorEl(event.currentTarget);
                  setContentRowAnchorEl(null);
                  setSubMenuAnchorEl(null);
              }}
              disabled={repoInfo.flavor !== "textTranslation"}
          >
              {doI18n("pages:content:export_pdf", i18nRef.current)}
          </MenuItem>                        
        </Menu>
        <UsfmExport
            bookNames={repoInfo.book_codes}
            repoSourcePath={repoInfo.path}
            open={usfmExportOpen}
            closeFn={() => setUsfmExportAnchorEl(null)}
        />
        <ZipExport
            bookNames={repoInfo.book_codes}
            repoSourcePath={repoInfo.path}
            open={zipExportOpen}
            closeFn={() => setZipExportAnchorEl(null)}
        />
        <PdfGenerate
            bookNames={repoInfo.book_codes}
            repoSourcePath={repoInfo.path}
            open={pdfGenerateOpen}
            closeFn={() => setPdfGenerateAnchorEl(null)}
        />
        <VersionManager
            repoInfo={repoInfo}
            open={versionManagerOpen}
            setOpen={setVersionManagerAnchorEl}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <NewTextTranslationBook
            repoInfo={repoInfo}
            open={newBookOpen}
            setOpen={setNewBookAnchorEl}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <CopyContent
            repoInfo={repoInfo}
            open={copyContentOpen}
            closeFn={() => setCopyContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <RemoteContent
            repoInfo={repoInfo}
            open={remoteContentOpen}
            closeFn={() => setRemoteContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <ArchiveContent
            repoInfo={repoInfo}
            open={archiveContentOpen}
            closeFn={() => setArchiveContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <QuarantineContent
            repoInfo={repoInfo}
            open={quarantineContentOpen}
            closeFn={() => setQuarantineContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <Commits
            repoInfo={repoInfo}
            open={commitsOpen}
            closeFn={() => setCommitsAnchorEl(null)}
        />
        <AddAndCommit
            repoInfo={repoInfo}
            open={addAndCommitOpen}
            closeFn={() => setAddAndCommitAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <PullFromDownloaded
            repoInfo={repoInfo}
            open={pullOpen}
            closeFn={() => setPullAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <PushToDcs
            repoInfo={repoInfo}
            open={pushOpen}
            closeFn={() => setPushAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <RestoreContent
            repoInfo={repoInfo}
            open={restoreContentOpen}
            closeFn={() => setRestoreContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <DeleteContent
            repoInfo={repoInfo}
            open={deleteContentOpen}
            closeFn={() => setDeleteContentAnchorEl(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
    </>
}

export default ContentRowButtonPlusMenu;