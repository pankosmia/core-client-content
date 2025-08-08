import { useState, useEffect, useCallback, useContext } from "react"
import { Grid2, Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Modal, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import { i18nContext, doI18n } from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DataGridComponent from "./components/DataGridComponent";
import { Close as CloseIcon } from '@mui/icons-material';

function App() {

    const { i18nRef } = useContext(i18nContext);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);
    const [contentUrl, setContentUrl] = useState("");

    const [experimentMenuAnchorEl, setExperimentMenuAnchorEl] = useState(null);
    const experimentMenuOpen = Boolean(experimentMenuAnchorEl);

    const [experimentDialogOpen, setExperimentDialogOpen] = useState(false);

    const handleExperimentMenuClick = (event) => {
        setExperimentMenuAnchorEl(event.currentTarget);
    };
    const handleExperimentMenuClose = () => {
        setExperimentMenuAnchorEl(null);
    };

    const handleExperimentDialogClickOpen = () => {
        setExperimentDialogOpen(true);
    };

    const handleExperimentDialogClose = () => {
        setExperimentDialogOpen(false);
    };

    /**
     * header 48px + SpaSpa's top margin of 16px + FabPlusMenu 34px + shadow 7px = fixed position of 105px
     * innerHeight is examined in the 2nd Box, so 105px less it's top margin of 16px = 89
     * bottom margin comes from this component, and SpaSpa's bottom margin of 16px is hidden
     */
    const [, setMaxWindowHeight] = useState(window.innerHeight - 89);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 89);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    return (
        <Box sx={{ mb: 2, position: 'fixed', top: '64px', bottom: 0, right: 0, overflow: 'scroll', width: '100%' }}>
            <Grid2 container sx={{ mx: 2 }}>
                <Grid2 container>
                    <Grid2 item size={12} sx={{ m: 0 }}>
                        <Grid2 container spacing={2} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <Grid2 item>
                                <FabPlusMenu
                                    newIsOpen={newIsOpen}
                                    setNewIsOpen={setNewIsOpen}
                                    reposModCount={reposModCount}
                                    setReposModCount={setReposModCount}
                                />
                            </Grid2>
                            <Grid2 item>
                                <Box sx={{ boxShadow: 3, borderRadius: 50 }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={handleExperimentMenuClick}
                                    >
                                        <HandymanOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={experimentMenuAnchorEl}
                                    open={experimentMenuOpen}
                                    onClose={handleExperimentMenuClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => { setContentUrl("?org=_local_/_archive_"); handleExperimentMenuClose(); handleExperimentDialogClickOpen() }}>
                                        {doI18n("pages:content:archived_content", i18nRef.current)}
                                    </MenuItem>
                                    <MenuItem onClick={() => { setContentUrl("?org=_local_/_quarantine_"); handleExperimentMenuClose(); handleExperimentDialogClickOpen() }}>
                                        {doI18n("pages:content:quarantined_content", i18nRef.current)}
                                    </MenuItem>
                                </Menu>
                                <Modal
                                    //maxWidth={"lg"}
                                    open={experimentDialogOpen}
                                    onClose={handleExperimentDialogClose}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        borderRadius: 2,
                                        minWidth:"50vw"
                                    }}>
                                        <AppBar  color='secondary' sx={{ position: 'relative',borderTopLeftRadius:4, borderTopRightRadius:4 }}>
                                            <Toolbar>
                                                <IconButton
                                                    edge="start"
                                                    color="inherit"
                                                    onClick={() => { handleExperimentDialogClose() }}
                                                    aria-label={doI18n("pages:content:close", i18nRef.current)}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                                    {doI18n("pages:content:experiment_content", i18nRef.current)}
                                                </Typography>
                                            </Toolbar>
                                        </AppBar>
                                        <Stack>
                                            <DataGridComponent
                                                isContentExperiment={true}
                                                contentUrl={contentUrl}
                                            />
                                        </Stack>
                                    </Box>

                                </Modal>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 item size={12}>
                        <DataGridComponent
                            isContentExperiment={false}
                            contentUrl={""}
                            experimentDialogOpen={experimentDialogOpen}
                        />
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default App;
