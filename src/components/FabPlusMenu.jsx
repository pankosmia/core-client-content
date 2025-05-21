import AddIcon from "@mui/icons-material/Add";
import { Fab, Menu, MenuItem, Typography } from "@mui/material";
import ListSubheader from '@mui/material/ListSubheader';
import NewBibleContent from "./NewContent";
import NewBcvContent from "./NewBcvResources";
import { useState, useContext } from "react";
import { i18nContext, netContext, doI18n } from "pithekos-lib";

function FabPlusMenu() {

    const { i18nRef } = useContext(i18nContext);
    const { enabledRef } = useContext(netContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openedModal, setOpenedModal] = useState(null);


    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTextBibleClick = () => {
        setOpenedModal('text-bible');
        setAnchorEl(null);
    };

    const handleBcvResourceClick = () => {
        setOpenedModal('bcv-content');
        setAnchorEl(null);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return <>
        <Fab
            variant="extended"
            size="small"
            color="secondary"
            aria-label={doI18n("pages:content:add", i18nRef.current)}
            sx={{
                margin: 0,
                top: '-18',
                right: "auto",
                bottom: "auto",
                left: 20,
                position: 'fixed',
            }}
            onClick={event => setAnchorEl(event.currentTarget)}
        >
            <AddIcon />
            <Typography variant="body2">
                {doI18n("pages:content:add", i18nRef.current)}
            </Typography>
        </Fab>
        <Menu
            id="grouped-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
        >
            <ListSubheader>{doI18n("pages:content:create_content_bcvresources", i18nRef.current)}</ListSubheader>
            <MenuItem onClick={handleTextBibleClick}>{doI18n("pages:content:create_content", i18nRef.current)}</MenuItem>
            <MenuItem onClick={handleBcvResourceClick}>{doI18n("pages:content:create_content_bcvresources", i18nRef.current)}</MenuItem>
            {/* <MenuItem
                onClick={handleCreateMenuClick}
            >
                {doI18n("pages:content:create_content", i18nRef.current)}
            </MenuItem> */}
            <MenuItem
                onClick={() => window.location.href = "/clients/download"}
                disabled={!enabledRef.current}
            >
                {doI18n("pages:content:download_content", i18nRef.current)}
            </MenuItem>
            <MenuItem
                onClick={handleMenuClose}
                disabled={true}
            >
                {doI18n("pages:content:sideload_content", i18nRef.current)}
            </MenuItem>
        </Menu>

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