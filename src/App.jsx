import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2} from "@mui/material";
import {getJson, debugContext, i18nContext, doI18n} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRow from "./components/ContentRow";

function App() {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);

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
        [newIsOpen]
    );

    return (
        <Box>
            <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen}/>
            <Box sx={{p: 0, backgroundColor: "#EEE"}}>
                <Grid2 container spacing={1} sx={{maxHeight: maxWindowHeight, backgroundColor: "#EEE"}}>
                    {
                        repos.length === 0 &&
                        <Grid2 item size={12} sx={{backgroundColor: "#FFF"}}>
                            {doI18n("pages:content:where_create_content", i18nRef.current)}
                        </Grid2>
                    }
                    {
                        repos.map((rep, n) => <ContentRow key={n} repoInfo={rep}/>)
                    }
                </Grid2>
            </Box>
        </Box>
    );
}

export default App;
