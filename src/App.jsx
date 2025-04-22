import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2, Fab, Menu, MenuItem} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {getJson, debugContext} from "pithekos-lib";
import NewContent from "./components/NewContent";

function App() {

    const {debugRef} = useContext(debugContext);

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
                aria-label="add"
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
                <MenuItem onClick={handleCreateMenuClick}>Create New Content</MenuItem>
                <MenuItem onClick={handleMenuClose} disabled={true}>Download Content</MenuItem>
                <MenuItem onClick={handleMenuClose} disabled={true}>Sideload Content</MenuItem>
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
