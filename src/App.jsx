import {useState, useEffect, useContext,useCallback} from "react"

import {Grid2, Box, IconButton} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {getJson, debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRowButtonPlusMenu from "./components/ContentRowButtonPlusMenu";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

function App() {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);
    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);
    const [projectSummaries, setProjectSummaries] = useState({});

    /**
     * header 48px + SpaSpa's top margin of 16px + FabPlusMenu 34px + shadow 7px = fixed position of 105px
     * innerHeight is examined in the 2nd Box, so 105px less it's top margin of 16px = 89
     * bottom margin comes from this component, and SpaSpa's bottom margin of 16px is hidden
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

    const getProjectSummaries = async () => {
        const summariesResponse = await getJson("/burrito/metadata/summaries", debugRef.current);
        if (summariesResponse.ok) {
            setProjectSummaries(summariesResponse.json);
        }
    }

    useEffect(
        () => {
            getProjectSummaries().then();
        },
        []
    );
    
    const flavorTypes = {
        texttranslation: "scripture",
        audiotranslation: "scripture",
        "x-bcvnotes": "parascriptural",
        "x-bnotes": "parascriptural",
        "x-bcvarticles": "parascriptural",
        "x-bcvquestions": "parascriptural",
        "x-bcvimages": "parascriptural",
        "x-juxtalinear": "scripture",
        "x-parallel": "parascriptural",
        textstories: "gloss",
        "x-obsquestions": "peripheral",
        "x-obsnotes": "peripheral",
        "x-obsarticles": "peripheral",
        "x-obsimages": "peripheral",
    };

    const columns = [
        {
            field: 'name',
            headerName: doI18n("pages:content:row_name", i18nRef.current),
            flex: 3
        },
        {
            field: 'language',
            headerName: doI18n("pages:content:row_language", i18nRef.current),
            flex: 0.75
        },
        {
            field: 'nBooks',
            headerName: doI18n("pages:content:row_nbooks", i18nRef.current),
            type: "number",
            flex: 0.5
        },
        {
            field: 'type',
            headerName: doI18n("pages:content:row_type", i18nRef.current),
            flex: 0.75,
            valueGetter: v => doI18n(`flavors:names:${flavorTypes[v.toLowerCase()]}/${v}`, i18nRef.current)
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
            flex: 0.5,
            renderCell: (params) => {
                return <>
                    {
                        params.row.path.startsWith("_local_") && ["textTranslation","x-bcvnotes","x-bcvquestions","textStories"].includes(params.row.type) ?
                            <IconButton
                                onClick={
                                    async () => {
                                        await postEmptyJson(`/navigation/bcv/${params.row.book_codes[0]}/1/1`);
                                        await postEmptyJson(`/app-state/current-project/${params.row.path}`);
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
                    <ContentRowButtonPlusMenu
                        repoInfo={params.row}
                        reposModCount={reposModCount}
                        setReposModCount={setReposModCount}
                    />
                </>;
            }
        }
    ]

    const filteredProject = Object.entries(projectSummaries).map((obj) => {return {...obj[1], path: obj[0]}})

    const rows = filteredProject.map((rep, n) => {
        return {
            ...rep,
            id: n,
            name: `${rep.name.trim()}${rep.description.trim() !== rep.name.trim() ? ": " + rep.description.trim() : ""}`,
            language: rep.language_code,
            nBooks: rep.book_codes.length,
            type: rep.flavor,
            source: rep.path.startsWith("_local_") ?
                doI18n("pages:content:local_org", i18nRef.current) :
                `${rep.path.split("/")[1]} (${rep.path.split("/")[0]})`,
            dateUpdated: rep.generated_date,
        }
    });

    return (
            <Box sx={{mb: 2, position: 'fixed', top: '64px', bottom: 0, right: 0, overflow: 'scroll', width: '100%'}}>
                <Grid2 container sx={{mx: 2}}>
                    <Grid2 container>
                        <Grid2 item size={12} sx={{m: 0}}>
                            <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen} reposModCount={reposModCount}
                                setReposModCount={setReposModCount}/>
                        </Grid2>
                        <Grid2 item size={12}>
                            <DataGrid
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                            nBooks: false,
                                            source: false,
                                            dateUpdated: false
                                        },
                                    },
                                    sorting: {
                                sortModel: [{ field: 'name', sort: 'asc' }],
                              }
                        }}
                                rows={rows}
                                columns={columns}
                                sx={{fontSize: "1rem"}}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
    );
}

export default App;
