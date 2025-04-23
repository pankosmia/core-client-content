import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2, Fab, Menu, MenuItem} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {getJson, debugContext, i18nContext, netContext, doI18n} from "pithekos-lib";
import NewContent from "./components/NewContent";

function App() {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);

    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 64);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 64);
    }, []);

    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);

    const [fabMenuAnchor, setFabMenuAnchor] = useState(null);
    const fabMenuOpen = Boolean(fabMenuAnchor);
    const handleMenuClick = event => {
        setFabMenuAnchor(null);
    };

    const handleCreateMenuClick = event => {
        setNewIsOpen(true);
        setFabMenuAnchor(null);
    };
    const handleMenuClose = () => {
        setFabMenuAnchor(null);
    };
    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    const getRepoList = async () => {
        const response = await getJson("/git/list-local-repos", debugRef.current);
        if (response.ok) {
            setRepos(response.json);
        }
    }

    useEffect(
        () => {
            getRepoList().then();
        },
        []
    );

    return (
        <Box>
            <Fab
                color="primary"
                aria-label={doI18n("pages:content:add", i18nRef.current)}
                sx={{
                    margin: 0,
                    top: 'auto',
                    right: 20,
                    bottom: 20,
                    left: 'auto',
                    position: 'fixed',
                }}
                onClick={event => setFabMenuAnchor(event.currentTarget)}
            >
                <AddIcon/>
            </Fab>
            <Menu
                id="fab-menu"
                anchorEl={fabMenuAnchor}
                open={fabMenuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClick}
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
            <Grid2 container spacing={1} sx={{maxHeight: maxWindowHeight}}>
                <Grid2 container>
                    {
                        repos
                            .map(
                                rep => {
                                    return <>
                                        <Grid2 item size={12}>
                                            {rep}
                                        </Grid2>
                                    </>
                                }
                            )
                    }
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default App;
