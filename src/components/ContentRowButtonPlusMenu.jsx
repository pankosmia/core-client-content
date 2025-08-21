import {IconButton, Menu, MenuItem, Divider} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {i18nContext, doI18n} from "pithekos-lib";
import UsfmExport from "./UsfmExport";
import PdfGenerate from "./PdfGenerate";
import CopyContent from "./CopyContent";
import RemoteContent from "./RemoteContent";
import ArchiveContent from "./ArchiveContent";
import QuarantineContent from "./QuarantineContent";
import RestoreContent from "./RestoreContent";
import DeleteContent from "./DeleteContent";
import NewTextTranslationBook from "./NewTextTranslationBook";
import {useState, useContext} from "react";

function ContentRowButtonPlusMenu({repoInfo, reposModCount, setReposModCount, isContentExperiment}) {

    const {i18nRef} = useContext(i18nContext);

    const [usfmExportAnchorEl, setUsfmExportAnchorEl] = useState(null);
    const usfmExportOpen = Boolean(usfmExportAnchorEl);

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

    const [restoreContentAnchorEl, setRestoreContentAnchorEl] = useState(null);
    const restoreContentOpen = Boolean(restoreContentAnchorEl);

    const [deleteContentAnchorEl, setDeleteContentAnchorEl] = useState(null);
    const deleteContentOpen = Boolean(deleteContentAnchorEl);

    const [newBookAnchorEl, setNewBookAnchorEl] = useState(null);
    const newBookOpen = Boolean(newBookAnchorEl);

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
            !isContentExperiment ? 
                <>
                    <MenuItem
                        onClick={(event) => {
                            setUsfmExportAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={repoInfo.flavor !== "textTranslation"}
                    >
                        {doI18n("pages:content:export_usfm", i18nRef.current)}
                    </MenuItem>
                    <MenuItem
                        onClick={(event) => {
                            setPdfGenerateAnchorEl(event.currentTarget);
                            setContentRowAnchorEl(null);
                        }}
                        disabled={repoInfo.flavor !== "textTranslation"}
                    >
                        {doI18n("pages:content:generate_pdf", i18nRef.current)}
                    </MenuItem>
                    <Divider/>
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
        <UsfmExport
            bookNames={repoInfo.book_codes}
            repoSourcePath={repoInfo.path}
            open={usfmExportOpen}
            closeFn={() => setUsfmExportAnchorEl(null)}
        />
        <PdfGenerate
            bookNames={repoInfo.book_codes}
            repoSourcePath={repoInfo.path}
            open={pdfGenerateOpen}
            closeFn={() => setPdfGenerateAnchorEl(null)}
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