import {Box, Fab, Menu, MenuItem, Typography} from "@mui/material";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NewBibleContent from "./NewTextTranslationContent";
import NewBcvContent from "./NewBcvContent";
import NewOBSContent from "./NewOBSContent";
import {useState, useContext} from "react";
import {i18nContext, netContext, doI18n} from "pithekos-lib";

function FabPlusMenu({reposModCount, setReposModCount}) {

    const {i18nRef} = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);
    const [importAnchorEl, setImportAnchorEl] = useState(null);
    const [createAnchorEl, setCreateAnchorEl] = useState(null);
    const [openedModal, setOpenedModal] = useState(null);
    const [resourceFormat, setResourceFormat] = useState("tn");

    const resourceFormatList = ["tn", "tq", "sq"];

    const handleImportClose = () => {
        setImportAnchorEl(null);
    };

    const handleCreateClose = () => {
        setCreateAnchorEl(null);
    };

    const handleTextBibleClick = () => {
        setOpenedModal('text-bible');
        setCreateAnchorEl(null);
    };

    const handleBcvResourceClick = () => {
        setOpenedModal('bcv-content');
        setCreateAnchorEl(null);
    }

    const handleOBSResourceClick = () => {
        setOpenedModal('obs-content');
        setCreateAnchorEl(null);
    }

    return <>
        <Box
            sx={{mb: 2}}
        >
            <Fab
                variant="extended"
                color="primary"
                size="small"
                aria-label={doI18n("pages:content:fab_import", i18nRef.current)}
                onClick={event => setImportAnchorEl(event.currentTarget)}
            >
                <DriveFolderUploadIcon sx={{mr: 1}}/>
                <Typography variant="body2">
                    {doI18n("pages:content:fab_import", i18nRef.current)}
                </Typography>
            </Fab>
            <Menu
                id="grouped-menu"
                anchorEl={importAnchorEl}
                open={!!importAnchorEl}
                onClose={handleImportClose}
            >
                <MenuItem
                    onClick={() => window.location.href = "/clients/download"}
                    disabled={!enabledRef.current}
                >
                    {doI18n("pages:content:download_content", i18nRef.current)}
                </MenuItem>
                <MenuItem
                    onClick={handleImportClose}
                    disabled={true}
                >
                    {doI18n("pages:content:import_content", i18nRef.current)}
                </MenuItem>
            </Menu>
            <Fab
                variant="extended"
                color="primary"
                size="small"
                aria-label={doI18n("pages:content:fab_create", i18nRef.current)}
                onClick={event => setCreateAnchorEl(event.currentTarget)}
                sx={{ml: 2}}
            >
                <CreateNewFolderIcon  sx={{mr: 1}}/>
                <Typography variant="body2">
                    {doI18n("pages:content:fab_create", i18nRef.current)}
                </Typography>
            </Fab>
            <Menu
                id="grouped-menu"
                anchorEl={createAnchorEl}
                open={!!createAnchorEl}
                onClose={handleCreateClose}
            >
                <MenuItem  onClick={() => window.location.href = "/clients/core-contenthandler_text_translation#/textTranslation"}>
                    {doI18n("pages:content:create_content", i18nRef.current)}
                </MenuItem>
                <MenuItem onClick={() => window.location.href = "/clients/core-contenthandler_bcv#/bookChapterVerse?resourceType=tn"}>
                    {doI18n("pages:content:create_content_tn", i18nRef.current)}
                </MenuItem>
                <MenuItem  onClick={() => window.location.href = "/clients/core-contenthandler_bcv#/bookChapterVerse?resourceType=tq"}>
                    {doI18n("pages:content:create_content_tq", i18nRef.current)}
                </MenuItem>
                <MenuItem  onClick={() => window.location.href = "/clients/core-contenthandler_bcv#/bookChapterVerse?resourceType=sq"}>
                    {doI18n("pages:content:create_content_sq", i18nRef.current)}
                </MenuItem>
                <MenuItem  onClick={() => window.location.href = "/clients/core-contenthandler_obs#/obsContent"}>
                    {doI18n("pages:content:create_content_obs", i18nRef.current)}
                </MenuItem>
            </Menu>
        </Box>
        <NewBibleContent
            open={openedModal === 'text-bible'}
            closeModal={() => setOpenedModal(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />
        <NewBcvContent
            open={openedModal === 'bcv-content'}
            closeModal={() => setOpenedModal(null)}
            reposModCount={reposModCount} 
            setReposModCount={setReposModCount}
            resourceFormat={resourceFormat}
        />
        <NewOBSContent
            open={openedModal === 'obs-content'}
            closeModal={() => setOpenedModal(null)}
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
        />

    </>;
}


export default FabPlusMenu;