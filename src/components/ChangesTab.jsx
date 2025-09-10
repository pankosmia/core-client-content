import {useState, useContext, useEffect, useRef} from 'react';
import {
    Grid2,
    Button,
    Typography,
    TextField,
    Box,
    Stack,
    Paper,
    Divider,
    Tooltip,
    Dialog, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar,
    Link
} from "@mui/material";
import { styled } from '@mui/material/styles';
import {debugContext, i18nContext, netContext, doI18n, postJson, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import {DataGrid} from '@mui/x-data-grid';
import PushToDcs from './PushToDcs';

const Item = styled(Paper)(({ theme }) => ({
    minHeight:'40vh',
    /* minWidth:'30vw', */
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

function ChangesTab({repoInfo, open, reposModCount, setReposModCount, setTabValue}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const {enabledRef} = useContext(netContext);

    const [status, setStatus] = useState([]);
    const [commits, setCommits] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [remoteUrlValue, setRemoteUrlValue] = useState('');
    const [commitMessageValue, setCommitMessageValue] = useState('');
    /* const commitMessageRef = useRef(''); */

    const [pushAnchorEl, setPushAnchorEl] = useState(null);
    const pushOpen = Boolean(pushAnchorEl);
    
    const [updateAnywaysAnchorEl, setUpdateAnywaysAnchorEl] = useState(null);
    const updateAnywaysOpen = Boolean(updateAnywaysAnchorEl);

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

    const repoRemotes = async (repo_path) => { 
        const remoteListUrl = `/git/remotes/${repo_path}`;
        const remoteList = await getJson(remoteListUrl, debugRef.current);
        if (remoteList.ok) {
            setRemotes(remoteList.json.payload.remotes);
            const originRecord = remoteList.json.payload.remotes.filter((p) => p.name === "origin")[0];
            if (originRecord) {
                setRemoteUrlValue(originRecord.url)
            }
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_list_remotes", i18nRef.current),
                {variant: "error"}
            )
        }
    };

    useEffect(() => {
        const doFetch = async () => {
            await repoStatus(repoInfo.path);
            await repoCommits(repoInfo.path);
            await repoRemotes(repoInfo.path)
        }
        if (open) {
            doFetch().then()
        }
    },
    [open]);

    const addAndCommitRepo = async (repo_path, commitMessage) => {

        const addAndCommitUrl = `/git/add-and-commit/${repo_path}`;
        const commitJson = JSON.stringify({"commit_message": commitMessage});
        const addAndCommitResponse = await postJson(addAndCommitUrl, commitJson, debugRef.current);
        if (addAndCommitResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:commit_complete", i18nRef.current),
                { variant: "success" }
            );
            setReposModCount(reposModCount + 1);
            await repoStatus(repoInfo.path);
            await repoCommits(repoInfo.path)
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_commit", i18nRef.current),
                { variant: "error" }
            );
        }
    };

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

   

    const handleCommitMessage = (e) => {
        
        /* commitMessageRef.current.value = e.target.value */
    };

    return <Box sx={{minHeight: "85vh"}}> 
            <Stack
                divider={<Divider orientation="horizontal" flexItem />}
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Item>
                    <Stack spacing={2} sx={{ minHeight:"100%", /* width:"100%", */ justifyContent: "flex-end", alignItems: "flex-start" }}>
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
                        <TextField
                            id="hhjhjkhjkhjkhjk"
                            fullWidth
                            label={doI18n("pages:content:commit_message", i18nRef.current)}
                           /*  ref={commitMessageRef} */
                            value={commitMessageValue}
                            variant="outlined"
                            onChange={(e) => setCommitMessageValue(e.target.value)}
                            required={true}
                            helperText={doI18n("pages:content:commit_helper_text", i18nRef.current)}
                        />
                        <Button
                            fullWidth
                            color="secondary"
                            disabled={status.length === 0 || commitMessageValue === ''}
                            onClick={() => { addAndCommitRepo(repoInfo.path, commitMessageValue).then() }}
                        >
                            {doI18n("pages:content:accept", i18nRef.current)}
                        </Button>
                    </Stack>
                </Item>
                <Item>
                    <Stack spacing={2} sx={{ minHeight:"100%"/* , width:"100%" */, justifyContent: "flex-end", alignItems: "flex-start" }}>
                        <Box sx={{height:"70%"}}>
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
                        </Box>
                        {
                            remotes.length === 0 && 
                            <Link 
                                component="button"
                                variant="body2"
                                onClick={() => {
                                    setTabValue(1);
                                }} 
                                underline="always"
                            >
                                Add remote url
                            </Link> 
                        }
                        <Tooltip title={doI18n("pages:content:app_should_be_connected", i18nRef.current)}>
                            <Button
                                onClick={(event) => {
                                    if (status.length > 0){
                                        setUpdateAnywaysAnchorEl(event.currentTarget)
                                    } else {
                                        setPushAnchorEl(event.currentTarget)
                                    }
                                    
                                }}
                                fullWidth
                                color='secondary'
                                disabled={!enabledRef.current || remotes.length === 0 || !remoteUrlValue.startsWith("https://")}
                            >
                                {doI18n("pages:content:push_to_dcs", i18nRef.current)}
                            </Button>
                        </Tooltip>
                    </Stack>
                </Item>
            </Stack>
            <PushToDcs
                repoInfo={repoInfo}
                open={pushOpen}
                closeFn={() => setPushAnchorEl(null)}
                reposModCount={reposModCount}
                setReposModCount={setReposModCount}
                status={status}
            />
            <Dialog
                open={updateAnywaysOpen}
                onClose={() => setUpdateAnywaysAnchorEl(null)}
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
                            Update without latest changes?
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="body1">
                            You have uncommitted changes etc.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="warning" onClick={() => setUpdateAnywaysAnchorEl(null)}>
                        {doI18n("pages:content:cancel", i18nRef.current)}
                    </Button>
                    <Button
                        variant='contained'
                        color="primary"

                        onClick={(event) => {
                            setPushAnchorEl(event.currentTarget);

                        }}
                    >{doI18n("pages:content:accept", i18nRef.current)}</Button>
                </DialogActions>
            </Dialog>
            {/* <Grid2 
                container 
                direction="column"
                spacing={0}
                sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "red",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Grid2 item size={6}>
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
                <Grid2 item size={6}>
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
            </Grid2> */}
        </Box>;
}

export default ChangesTab;