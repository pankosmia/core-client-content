import {useState, useContext, useEffect} from 'react';
import {
    Grid2,
    Button,
    Typography,
    TextField,
    Divider,
    Box
} from "@mui/material";

import {debugContext, i18nContext, doI18n, postEmptyJson, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import {DataGrid} from '@mui/x-data-grid';

function ChangesTab({repoInfo, open, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);

    const [status, setStatus] = useState([]);
    const [commits, setCommits] = useState([]);

    const repoStatus = async repo_path => {

        const statusUrl = `/git/status/${repo_path}`;
        const statusResponse = await getJson(statusUrl, debugRef.current);
        if (statusResponse.ok) {
            setStatus(statusResponse.json);
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_status", i18nRef.current),
                { variant: "error" }
            );
        }
    };

    const repoCommits = async repo_path => {

        const commitsUrl = `/git/log/${repo_path}`;
        const commitsResponse = await getJson(commitsUrl, debugRef.current);
        if (commitsResponse.ok) {
            setCommits(commitsResponse.json);
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_commits", i18nRef.current),
                { variant: "error" }
            );
        }
    };

    useEffect(() => {
        if (open === true) {
            repoStatus(repoInfo.path).then();
            repoCommits(repoInfo.path).then();
        }
    },
    [open]);

    const statusColumns = [
        {
            field: 'status',
            headerName: doI18n("pages:content:status", i18nRef.current),
            minWidth: 200,
            flex: 3
        },
        {
            field: 'path',
            headerName: doI18n("pages:content:row_path", i18nRef.current),
            minWidth: 200,
            flex: 3
        }
    ];

    const statusRows = status.map((s, n) => {
        return {
            ...s,
            id: n,
            status: s.change_type,
            path: s.path
        }
    });

    const commitsColumns = [
        {
            field: 'author',
            headerName: doI18n("pages:content:row_author", i18nRef.current),
            minWidth: 200,
            flex: 3
        },
        {
            field: 'date',
            headerName: doI18n("pages:content:row_date", i18nRef.current),
            minWidth: 200,
            flex: 3
        },
        {
            field: 'message',
            headerName: doI18n("pages:content:row_message", i18nRef.current),
            minWidth: 200,
            flex: 3
        }
    ];

    const commitsRows = commits.map((c, n) => {
        return {
            ...c,
            id: n,
            commitId: c.id,
            author: c.author,
            date: c.date,
            message: c.message
        }
    });


    return <Box sx={{height: "100%", backgroundColor:"blue", border: 2, borderColor: "red"}}> 
            <Grid2 
                container 
                direction="column"
                sx={{
                    height: "100%",
                    width: "100%",
                    backgroudColor: "red",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                }}
            >
                <Grid2 item sx={{height: "50%"}}>
                    <Grid2 
                        container
                        direction="column"
                        sx={{
                            
                            justifyContent: "space-around",
                            alignItems: "flex-start",
                        }}
                    >
                        <Grid2 item sx={{backgroundColor:"green"}}>
                            {status.length > 0 
                                ?
                                <DataGrid
                                    initialState={{
                                        sorting: {
                                            sortModel: [{ field: 'path', sort: 'asc' }],
                                        }
                                    }}
                                    rows={statusRows}
                                    columns={statusColumns}
                                    sx={{fontSize: "1rem"}}
                                />
                                :
                                <Typography variant="h6">
                                    {doI18n("pages:content:no_changes", i18nRef.current)}
                                </Typography>
                            }
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 item sx={{my: "16px"}}>
                    <Divider  />
                </Grid2>
                <Grid2 item sx={{height: "50%",}}>
                    <Grid2 
                        container
                        direction="column"
                        sx={{
                            
                            justifyContent: "space-around",
                            alignItems: "flex-start",
                        }}
                    >
                        <Grid2 item sx={{backgroundColor:"orange"}}>
                            {commits.length > 0 
                                ?
                                <DataGrid
                                    initialState={{
                                        sorting: {
                                            sortModel: [{ field: 'date', sort: 'desc' }],
                                        }
                                    }}
                                    rows={commitsRows}
                                    columns={commitsColumns}
                                    sx={{fontSize: "1rem"}}
                                />
                                :
                                <Typography variant="h6">
                                    {doI18n("pages:content:no_commits", i18nRef.current)}
                                </Typography>
                            }
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>;
}

export default ChangesTab;