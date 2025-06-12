import {useState, useEffect, useCallback, useContext} from "react"
import {Box} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {getJson, debugContext, i18nContext, doI18n} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRowButtonPlusMenu from "./components/ContentRowButtonPlusMenu";

function App() {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);
    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);

    /** header 48px + SpSpa margins 32px (top and bottom) + FAB 56px + inset 20px + add 4px to SpaSpa bottom margin to match the inset = 160 */
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 160);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 160);
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

    const columns = [
        {
            field: 'name',
            headerName: doI18n("pages:content:row_name", i18nRef.current),
            flex: 1
        },
        {
            field: 'language',
            headerName: doI18n("pages:content:row_language", i18nRef.current),
            flex: 1
        },
        {
            field: 'nBooks',
            headerName: doI18n("pages:content:row_nbooks", i18nRef.current),
            type: "number",
            flex: 1
        },
        {
            field: 'type',
            headerName: doI18n("pages:content:row_type", i18nRef.current),
            flex: 1
        },
        {
            field: 'source',
            headerName: doI18n("pages:content:row_source", i18nRef.current),
            flex: 1
        },
        {
            field: 'dateUpdated',
            headerName: doI18n("pages:content:row_date_updated", i18nRef.current),
            flex: 1
        },
        {
            field: 'actions',
            headerName: doI18n("pages:content:row_actions", i18nRef.current),
            flex: 1,
            /*
            renderCell: rep => <ContentRowButtonPlusMenu
                    repoInfo={rep}
                    reposModCount={reposModCount}
                    setReposModCount={setReposModCount}
                />
             */
        }
    ]

    const rows = repos.map((rep, n) => {
        return {
            id: n,
            name: `${rep.name.trim()}${rep.description.trim() !== rep.name.trim() ? ": " + rep.description.trim() : ""}`,
            language: rep.language_code,
            nBooks: rep.bookCodes.length,
            type: rep.flavor,
            source: rep.path.startsWith("_local_") ?
                doI18n("pages:content:local_org", i18nRef.current) :
                `${rep.path.split("/")[1]} (${rep.path.split("/")[0]})`,
            dateUpdated: rep.generated_date,
        }
    });

    return (
            <Box sx={{maxHeight: maxWindowHeight, m: 0}}>
                <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen}/>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    sx={{paddingTop: "36px"}}
                />
            </Box>
    );
}

export default App;
