import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2, Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {getJson, debugContext} from "pithekos-lib";
import NewPicker from "./components/NewPicker";

function App() {

    const {debugRef} = useContext(debugContext);

    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 64);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 64);
    }, []);

    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);


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
                onClick={() => setNewIsOpen(true)}
            >
                <AddIcon/>
            </Fab>
            <NewPicker
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
