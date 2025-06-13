import {useState, useEffect, useContext} from "react"
import {Box, Grid2} from "@mui/material";
import {getJson, debugContext} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRow from "./components/ContentRow";

function App() {

    const {debugRef} = useContext(debugContext);
    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);

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
            <Box style={{position: 'fixed', top: '64px', width: '100%'}}>
              <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen}/>
            </Box>
            <Box sx={{ mb: 2, position: 'fixed', top: '121px', bottom: 0, right: 0, overflow: 'scroll', width: '100%' }}>
              <Box sx={{mx: 2}}>
                <Grid2 container
                  sx={{'--Grid-borderWidth': '1px',
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
        </Box>
    );
}

export default App;
