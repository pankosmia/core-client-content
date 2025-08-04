import {useState, useEffect, /* useContext, */ useCallback} from "react"

import {Grid2, Box, IconButton, /* ButtonGroup, */ Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem} from "@mui/material";
//import {DataGrid} from '@mui/x-data-grid';
import {i18nContext, doI18n/* , postEmptyJson, getJson, debugContext */} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
//import ContentRowButtonPlusMenu from "./components/ContentRowButtonPlusMenu";
//import EditIcon from "@mui/icons-material/Edit";
//import EditOffIcon from "@mui/icons-material/EditOff";
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DataGridComponent from "./components/DataGridComponent";

function App() {

/*     const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext); */
    //const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);
    //const [projectSummaries, setProjectSummaries] = useState({});
    //const [currentProjectFilter, setCurrentProjectFilter] = useState("");\

    const [ contentUrl, setContentUrl ] = useState("");

    const [experimentMenuAnchorEl, setExperimentMenuAnchorEl] = useState(null);
    const experimentMenuOpen = Boolean(experimentMenuAnchorEl);

    const [experimentDialogOpen, setExperimentDialogOpen] = useState(false);

    const handleExperimentMenuClick = (event) => {
        setExperimentMenuAnchorEl(event.currentTarget);
      };
    const handleExperimentMenuClose = () => {
    setExperimentMenuAnchorEl(null);
    };
  
    const handleExperimentDialogClickOpen = () => {
      setExperimentDialogOpen(true);
    };
  
    const handleExperimentDialogClose = () => {
      setExperimentDialogOpen(false);
    };

    /**
     * header 48px + SpaSpa's top margin of 16px + FabPlusMenu 34px + shadow 7px = fixed position of 105px
     * innerHeight is examined in the 2nd Box, so 105px less it's top margin of 16px = 89
     * bottom margin comes from this component, and SpaSpa's bottom margin of 16px is hidden
     */
    const [, setMaxWindowHeight] = useState(window.innerHeight - 89);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 89);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    

/*     const getProjectSummaries = async () => {
        const summariesResponse = await getJson(`/burrito/metadata/summaries${currentProjectFilter}`, debugRef.current);
        if (summariesResponse.ok) {
            setProjectSummaries(summariesResponse.json);
        }
    }

    useEffect(
        () => {
            getProjectSummaries().then();
        },
        [currentProjectFilter]
    ); */
    
/*     const flavorTypes = {
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
    }; */

    /* const contentFilters = {
        "allActive": "",
        "activeResources": "?org=git.door43.org/BurritoTruck",
        "activeLocal": "?org=_local_/_local_",
        "archived": "?org=_local_/_archive_",
        "quarantined": "?org=_local_/_quarantine_"
    } */

 /*    const columns = [
        {
            field: 'name',
            headerName: doI18n("pages:content:row_name", i18nRef.current),
            minWidth: 110,
            flex: 3
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
            field: 'source',
            headerName: doI18n("pages:content:row_source", i18nRef.current),
            minWidth: 110,
            flex: 1
        },
        {
            field: 'dateUpdated',
            headerName: doI18n("pages:content:row_date_updated", i18nRef.current),
            minWidth: 200,
            flex: 1
        },
        {
            field: 'actions',
            minWidth: 100,
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
    ] */

/*     const filteredProject = Object.entries(projectSummaries).map((obj) => {return {...obj[1], path: obj[0]}})

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
 */
    return (
            <Box sx={{mb: 2, position: 'fixed', top: '64px', bottom: 0, right: 0, overflow: 'scroll', width: '100%'}}>
                <Grid2 container sx={{mx: 2}}>
                    <Grid2 container>
                        <Grid2 item size={12} sx={{m: 0}}>
                            <Grid2 container spacing={1.5} direction="row" sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <Grid2 item>
                                    <FabPlusMenu 
                                        newIsOpen={newIsOpen} 
                                        setNewIsOpen={setNewIsOpen} 
                                        reposModCount={reposModCount}
                                        setReposModCount={setReposModCount}
                                    />
                                </Grid2>
                                <Grid2 item>
                                    <Box sx={{ boxShadow: 3, borderRadius: 50 }}>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleExperimentMenuClick}
                                        >
                                            <HandymanOutlinedIcon/>
                                        </IconButton>
                                    </Box>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={experimentMenuAnchorEl}
                                        open={experimentMenuOpen}
                                        onClose={handleExperimentMenuClose}
                                        slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                        }}
                                    >
                                        <MenuItem onClick={() => {setContentUrl("?org=_local_/_archive_"); handleExperimentDialogClickOpen()}}>Archived content</MenuItem>
                                        <MenuItem onClick={() => {setContentUrl("?org=_local_/_quarantine_"); handleExperimentDialogClickOpen()}}>Quarantined content</MenuItem>
                                    </Menu>
                                    <Dialog
                                        fullWidth={true}
                                        maxWidth={"lg"}
                                        open={experimentDialogOpen}
                                        onClose={handleExperimentDialogClose}
                                    >
                                        <DialogTitle>Experiment content</DialogTitle>
                                        <DialogContent>
                                            <DataGridComponent
                                                isContentExperiment={true}
                                                contentUrl={contentUrl}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleExperimentDialogClose}>Close</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid2>
                            </Grid2>
                            
                            {/* <ButtonGroup>
                                {
                                    Object.entries(contentFilters).map(
                                        f => <Button
                                            variant={f[1] === currentProjectFilter ? "contained" : "outlined"}
                                            onClick={() => setCurrentProjectFilter(f[1])}
                                        >
                                            {f[0]}
                                        </Button>
                                    )
                                }
                            </ButtonGroup> */}
                        </Grid2>
                        <Grid2 item size={12}>
                            <DataGridComponent
                                isContentExperiment={false}
                                contentUrl={""}
                            />
                            {/* <DataGrid
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
                            /> */}
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
    );
}

export default App;
