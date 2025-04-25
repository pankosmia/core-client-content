import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2, Fab, Menu, MenuItem, Stack, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {getJson, debugContext, i18nContext, netContext, doI18n, postEmptyJson} from "pithekos-lib";
import dateFormat from 'dateformat';
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
        const listResponse = await getJson("/git/list-local-repos", debugRef.current);
        if (listResponse.ok) {
            let responses = [];
            for (const repoPath of listResponse.json) {
                const metadataResponse = await getJson(`/burrito/metadata/summary/${repoPath}`);
                if (metadataResponse.ok) {
                    responses.push({path: repoPath, ...metadataResponse.json})
                }
            }
            setRepos(responses);
        }
    }

    useEffect(
        () => {
            if (!newIsOpen) {
                getRepoList().then();
            }
        },
        [newIsOpen]
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
            <Box sx={{p: 1, backgroundColor: "#EEE"}}>
                <Grid2 container spacing={1} sx={{maxHeight: maxWindowHeight, backgroundColor: "#EEE"}}>
                    {
                        repos
                            .map(
                                ((rep, n) => {
                                        return <>
                                            <Grid2 key={`${n}-name`} item size={4} sx={{backgroundColor: "#FFF"}}>
                                                <Stack>
                                                    <Box><b>{`${rep.name} (${rep.abbreviation})`}</b></Box>
                                                    {rep.description !== rep.name &&
                                                        <Box>{rep.description}</Box>
                                                    }
                                                </Stack>
                                            </Grid2>
                                            <Grid2 key={`${n}-language`} item size={1} sx={{backgroundColor: "#FFF"}}>
                                                {rep.language_code}
                                            </Grid2>
                                            <Grid2 key={`${n}-flavor`} item size={2} sx={{backgroundColor: "#FFF"}}>
                                                {rep.flavor}
                                            </Grid2>
                                            <Grid2 key={`${n}-source`} item size={2} sx={{backgroundColor: "#FFF"}}>
                                                {
                                                    rep.path.startsWith("_local_") ?
                                                        "Local" :
                                                        rep.path.split("/").slice(0, 2).join(" ")
                                                }
                                            </Grid2>
                                            <Grid2 key={`${n}-date`} item size={1} sx={{backgroundColor: "#FFF"}}>
                                                {dateFormat(rep.generated_date, "mmm d yyyy")}
                                            </Grid2>
                                            <Grid2 key={`${n}-actions`} item size={2} display="flex"
                                                   justifyContent="flex-end" alignItems="center"
                                                   sx={{backgroundColor: "#FFF"}}>
                                                {
                                                    rep.path.startsWith("_local_") ?
                                                        <IconButton
                                                            onClick={
                                                                async () => {
                                                                    await postEmptyJson(`/app-state/current-project/${rep.path}`);
                                                                    window.location.href = "/clients/local-projects";
                                                                }
                                                            }
                                                        >
                                                            <EditIcon/>
                                                        </IconButton> :
                                                        <IconButton disabled={true}>
                                                            <EditOffIcon/>
                                                        </IconButton>
                                                }
                                                <IconButton>
                                                    <MoreVertIcon/>
                                                </IconButton>
                                            </Grid2>
                                        </>
                                    }
                                )
                            )
                    }
                </Grid2>
            </Box>
        </Box>
    );
}

export default App;
