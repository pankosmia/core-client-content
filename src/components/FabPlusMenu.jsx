import {Box, Fab, Menu, MenuItem, Typography} from "@mui/material";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NewBibleContent from "./NewTextTranslationContent";
import NewBcvContent from "./NewBcvContent";
import {useState, useContext} from "react";
import {i18nContext, netContext, doI18n} from "pithekos-lib";

function FabPlusMenu() {

    const {i18nRef} = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);
    const [importAnchorEl, setImportAnchorEl] = useState(null);
    const [createAnchorEl, setCreateAnchorEl] = useState(null);
    const [openedModal, setOpenedModal] = useState(null);


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
                    {doI18n("pages:content:sideload_content", i18nRef.current)}
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
                <MenuItem
                    onClick={handleTextBibleClick}>{doI18n("pages:content:create_content", i18nRef.current)}
                </MenuItem>
                <MenuItem onClick={handleBcvResourceClick}>
                    {doI18n("pages:content:create_content_bcvresources", i18nRef.current)}
                </MenuItem>
            </Menu>
        </Box>
        <NewBibleContent
            open={openedModal === 'text-bible'}
            closeModal={() => setOpenedModal(null)}
        />
        <NewBcvContent
            open={openedModal === 'bcv-content'}
            closeModal={() => setOpenedModal(null)}
        />

    </>;
}


export default FabPlusMenu;