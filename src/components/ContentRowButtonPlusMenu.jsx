import {IconButton, Menu, MenuItem, Divider} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {i18nContext, doI18n} from "pithekos-lib";
import UsfmExport from "./UsfmExport";
import PdfGenerate from "./PdfGenerate";
import DeleteContent from "./DeleteContent";
import NewBook from "./NewBook";
import ImportBook from "./ImportBook";

import {useState, useContext} from "react";

function ContentRowButtonPlusMenu({repoInfo, reposModCount, setReposModCount}) {

    const {i18nRef} = useContext(i18nContext);

    const [usfmExportAnchorEl, setUsfmExportAnchorEl] = useState(null);
    const usfmExportOpen = Boolean(usfmExportAnchorEl);

    const [pdfGenerateAnchorEl, setPdfGenerateAnchorEl] = useState(null);
    const pdfGenerateOpen = Boolean(pdfGenerateAnchorEl);

    const [contentRowAnchorEl, setContentRowAnchorEl] = useState(null);
    const contentRowOpen = Boolean(contentRowAnchorEl);

    const [deleteContentAnchorEl, setDeleteContentAnchorEl] = useState(null);
    const deleteContentOpen = Boolean(deleteContentAnchorEl);

    const [newBookAnchorEl, setNewBookAnchorEl] = useState(null);
    const newBookOpen = Boolean(newBookAnchorEl);

    const [importBookAnchorEl, setImportBookAnchorEl] = useState(null);
    const importBookOpen = Boolean(importBookAnchorEl);

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
            >
                {doI18n("pages:content:new_book", i18nRef.current)}
            </MenuItem>
            <MenuItem
                onClick={(event) => {
                    setImportBookAnchorEl(event.currentTarget);
                    setContentRowAnchorEl(null);
                }}
            >
                {doI18n("pages:content:import_book", i18nRef.current)}
            </MenuItem>
            <Divider/>
            <MenuItem
                onClick={(event) => {
                    setDeleteContentAnchorEl(event.currentTarget);
                    setContentRowAnchorEl(null);
                }}
            >
                {doI18n("pages:content:delete_content", i18nRef.current)}
            </MenuItem>
        </Menu>
        <UsfmExport
            bookNames={repoInfo.bookCodes}
            repoSourcePath={repoInfo.path}
            open={usfmExportOpen}
            closeFn={() => setUsfmExportAnchorEl(null)}
        />
        <PdfGenerate
            bookNames={repoInfo.bookCodes}
            repoSourcePath={repoInfo.path}
            open={pdfGenerateOpen}
            closeFn={() => setPdfGenerateAnchorEl(null)}
        />
        <NewBook
            repoInfo={repoInfo}
            open={newBookOpen}
            setOpen={setNewBookAnchorEl}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <ImportBook
            repoInfo={repoInfo}
            wrapperDialogOpen={importBookOpen}
            setWrapperDialogOpen={setImportBookAnchorEl}
       /*      reposModCount={reposModCount}
            setReposModCount={setReposModCount} */
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