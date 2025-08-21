import {useState, useEffect, useContext} from "react"
import {IconButton} from "@mui/material";
import {getJson, debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import {DataGrid} from '@mui/x-data-grid';
import ContentRowButtonPlusMenu from "./ContentRowButtonPlusMenu";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

function DataGridComponent({reposModCount, setReposModCount, isContentExperiment, contentUrl, experimentDialogOpen}) {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);
    const [projectSummaries, setProjectSummaries] = useState({});

    const getProjectSummaries = async () => {
        const summariesResponse = await getJson(`/burrito/metadata/summaries${isContentExperiment ? contentUrl : ""}`, debugRef.current);
        if (summariesResponse.ok) {
            setProjectSummaries(summariesResponse.json);
        }
    }

    useEffect(
        () => {
            getProjectSummaries().then();
        },
        [reposModCount, experimentDialogOpen]
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
            minWidth: 110,
            flex: 3
        },
        {
            field: 'source',
            headerName: doI18n("pages:content:row_source", i18nRef.current),
            minWidth: 110,
            flex: 1
        },
        {
            field: 'language',
            headerName: doI18n("pages:content:row_language", i18nRef.current),
            minWidth: 120,
            flex: 0.75
        },
        {
            field: 'nBooks',
            headerName: doI18n("pages:content:row_nbooks", i18nRef.current),
            type: "number",
            minWidth: 150,
            flex: 0.5
        },
        {
            field: 'type',
            headerName: doI18n("pages:content:row_type", i18nRef.current),
            minWidth: 80,
            flex: 0.75,
            valueGetter: v => doI18n(`flavors:names:${flavorTypes[v.toLowerCase()]}/${v}`, i18nRef.current)
        },
        {
            field: 'dateUpdated',
            headerName: doI18n("pages:content:row_date_updated", i18nRef.current),
            minWidth: 200,
            flex: 1
        },
        {
            field: 'actions',
            minWidth: !isContentExperiment ? 100 : 75,
            headerName: doI18n("pages:content:row_actions", i18nRef.current),
            flex: !isContentExperiment ? 0.5 : 0.3,
            renderCell: (params) => {
                return <>
                    { !isContentExperiment &&
                    <>{
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
                    }</>
                    }
                    <ContentRowButtonPlusMenu
                        repoInfo={params.row}
                        reposModCount={reposModCount}
                        setReposModCount={setReposModCount}
                        isContentExperiment={isContentExperiment}
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
                (rep.path.startsWith("_local_/_sideloaded_") ? doI18n("pages:content:local_resource", i18nRef.current) : doI18n("pages:content:local_project", i18nRef.current)) :
                `${rep.path.split("/")[1]} (${rep.path.split("/")[0]})`,
            dateUpdated: rep.generated_date,
        }
    });

    return (
            <DataGrid
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            nBooks: false,
                            source: isContentExperiment ? false : true,
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
    );
}

export default DataGridComponent;