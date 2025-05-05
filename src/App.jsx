import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2} from "@mui/material";
import {getJson, debugContext} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRow from "./components/ContentRow";

function App() {

    const {debugRef} = useContext(debugContext);
    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);

    /** 
     * header 48px + FabPlusMenu 34px + shadow 7px = 89
     * Applied inside the SpSpa margins, so that's not included.
     * Bottom margin comes from this component, and SpaSpa's bottom margin is hidden.
     */
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 89);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 89);
    }, []);


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
                const fullMetadataResponse = await getJson(`/burrito/metadata/raw/${repoPath}`);
                if (fullMetadataResponse.ok) {
                    responses[responses.length - 1]["bookCodes"] =
                        Object.entries(fullMetadataResponse.json.ingredients)
                            .map(
                                i =>
                                    Object.keys(i[1].scope || {})
                            )
                            .reduce(
                                (a, b) => [...a, ...b],
                                []
                            );
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
        [newIsOpen, reposModCount]
    );

    return (
        <Box>
            <Box style={{position: 'fixed', width: '100%'}}>
              <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen}/>
            </Box>
            <Box sx={{p: 0, maxHeight: maxWindowHeight, mb:'16px'}} style={{position: 'fixed', top: '105px', bottom: 0, right: 0, overflow: 'scroll', width: '100%'}}>
                <Grid2 container
                  sx={{'--Grid-borderWidth': '1px',
                    ml: 2,
                    borderTop: 'var(--Grid-borderWidth) solid',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    '& > div': {
                    borderRight: 'var(--Grid-borderWidth) solid',
                    borderBottom: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                  }
                }}
                >
                    {
                        repos.map((rep, n) => <ContentRow
                            key={n}
                            repoInfo={rep}
                            reposModCount={reposModCount}
                            setReposModCount={setReposModCount}
                        />)
                    }
                </Grid2>
            </Box>
        </Box>
    );
}

export default App;
