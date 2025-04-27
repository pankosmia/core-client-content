import {useState, useEffect, useCallback, useContext} from "react"
import {Box, Grid2, Stack, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import {getJson, debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import dateFormat from 'dateformat';
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRowButtonPlusMenu from "./components/ContentRowButtonPlusMenu";

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
            <Box sx={{p: 1, backgroundColor: "#EEE"}}>
                <Grid2 container spacing={1} sx={{maxHeight: maxWindowHeight, backgroundColor: "#EEE"}}>
                    {
                        repos.length === 0 &&
                        <Grid2 item size={12} sx={{backgroundColor: "#FFF"}}>
                            {doI18n("pages:content:where_create_content", i18nRef.current)}
                        </Grid2>
                    }
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
                                            <Grid2 key={`${n}-books`} item size={1} sx={{backgroundColor: "#FFF"}}>
                                                {`${rep.bookCodes.length} ${doI18n("pages:content:book_or_books", i18nRef.current)}`}
                                            </Grid2>
                                            <Grid2 key={`${n}-flavor`} item size={2} sx={{backgroundColor: "#FFF"}}>
                                                {rep.flavor}
                                            </Grid2>
                                            <Grid2 key={`${n}-source`} item size={2} sx={{backgroundColor: "#FFF"}}>
                                                {
                                                    rep.path.startsWith("_local_") ?
                                                        doI18n("pages:content:local_org", i18nRef.current) :
                                                        rep.path.split("/").slice(0, 2).join(" ")
                                                }
                                            </Grid2>
                                            <Grid2 key={`${n}-date`} item size={1} sx={{backgroundColor: "#FFF"}}>
                                                {dateFormat(rep.generated_date, "mmm d yyyy")}
                                            </Grid2>
                                            <Grid2 key={`${n}-actions`} item size={1} display="flex"
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
                                                <ContentRowButtonPlusMenu repoInfo={rep}/>
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
