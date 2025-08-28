import { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Toolbar,
    Typography
} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import { debugContext, i18nContext, doI18n, getJson } from "pithekos-lib";
import { enqueueSnackbar } from "notistack";

function Commits({ repoInfo, open, closeFn }) {
    const { i18nRef } = useContext(i18nContext);
    const { debugRef } = useContext(debugContext);
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

    const columns = [
        {
            field: 'status',
            headerName: doI18n("pages:content:status", i18nRef.current),
            minWidth: 110,
            flex: 3
        },
        {
            field: 'path',
            headerName: doI18n("pages:content:row_path", i18nRef.current),
            minWidth: 110,
            flex: 3
        }
    ];

    const rowInfo = [...commits, ...status];

    const rows = commits.map((c, n) => {
        return {
            ...c,
            id: n,
            status: c.change_type,
            path: c.path
        }
    });

    console.log(status);
    console.log(commits);

    return <Dialog
        open={open}
        onClose={closeFn}
        fullWidth={true}
        maxWidth={"lg"}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:commits", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
            </DialogContentText>
            {commits.length > 0 
                ?
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'path', sort: 'asc' }],
                        }
                    }}
                    rows={rows}
                    columns={columns}
                    sx={{fontSize: "1rem"}}
                />
                :
                <Typography variant="h6">
                    {doI18n("pages:content:no_changes", i18nRef.current)}
                </Typography>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                color="warning"
                onClick={closeFn}
            >{doI18n("pages:content:accept", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default Commits;