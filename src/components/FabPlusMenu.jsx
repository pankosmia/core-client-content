import AddIcon from "@mui/icons-material/Add";
import {Fab, Menu, MenuItem, Typography} from "@mui/material";
import NewContent from "./NewContent";
import {useState, useContext} from "react";
import {i18nContext, netContext, doI18n} from "pithekos-lib";

function FabPlusMenu({newIsOpen, setNewIsOpen}) {

    const [fabMenuAnchor, setFabMenuAnchor] = useState(null);
    const fabMenuOpen = Boolean(fabMenuAnchor);
    const {i18nRef} = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);

    const handleCreateMenuClick = () => {
        setNewIsOpen(true);
        setFabMenuAnchor(null);
    };
    const handleMenuClose = () => {
        setFabMenuAnchor(null);
    };

    return <>
        <Fab
            variant="extended"
            size="small"
            aria-label={doI18n("pages:content:add", i18nRef.current)}
            sx={{
                margin: 0,
                top: '-18',
                right: "auto",
                bottom: "auto",
                left: 20,
                position: 'fixed',
                backgroundColor: "#DAB1DA",
                color: "#OOO"
            }}
            onClick={event => setFabMenuAnchor(event.currentTarget)}
        >
            <AddIcon/>
            <Typography variant="body2">
              {doI18n("pages:content:add", i18nRef.current)}
            </Typography>
        </Fab>
        <Menu
            id="fab-menu"
            anchorEl={fabMenuAnchor}
            open={fabMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
        >
            <MenuItem
                onClick={handleCreateMenuClick}
            >
                {doI18n("pages:content:create_content", i18nRef.current)}
            </MenuItem>
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
        <NewContent
            open={newIsOpen}
            setOpen={setNewIsOpen}
        />
    </>;
}

export default FabPlusMenu;