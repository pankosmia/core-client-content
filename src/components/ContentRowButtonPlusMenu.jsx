import {IconButton, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {i18nContext, doI18n} from "pithekos-lib";
import UsfmExport from "./UsfmExport";
import PdfGenerate from "./PdfGenerate";
import {useState, useContext} from "react";

function ContentRowButtonPlusMenu({repoInfo}) {

    const {i18nRef} = useContext(i18nContext);

    const [usfmExportAnchorEl, setUsfmExportAnchorEl] = useState(null);
    const usfmExportOpen = Boolean(usfmExportAnchorEl);

    const [pdfGenerateAnchorEl, setPdfGenerateAnchorEl] = useState(null);
    const pdfGenerateOpen = Boolean(pdfGenerateAnchorEl);

    const [contentRowAnchorEl, setContentRowAnchorEl] = useState(null);
    const contentRowOpen = Boolean(contentRowAnchorEl);

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
    </>
}

export default ContentRowButtonPlusMenu;