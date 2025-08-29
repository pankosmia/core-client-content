import {useState, useContext, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography,
    TextField,
    Stack,
    AppBar,
    Toolbar,
    List, ListItemButton, ListItemIcon, ListItemText
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import {debugContext, i18nContext, doI18n, postEmptyJson, getJson} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";

function RemoteContent({repoInfo, open, closeFn, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [remoteUrlValue, setRemoteUrlValue] = useState('');
    const remoteUrlRegex = new RegExp(/^\S+@\S+:\S+$/);
    const [remotes, setRemotes] = useState(null);
    const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        const doFetch = async () => { 
            const remoteListUrl = `/git/remotes/${repoInfo.path}`;
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
        }
        doFetch().then()
    },
    [reposModCount])

    const addRemoteRepo = async repo_path => {

        if (remotes.filter((p) => p.name === "origin")[0]) {
            const deleteUrl = `/git/remote/delete/${repo_path}?remote_name=origin`;
            const deleteResponse = await postEmptyJson(deleteUrl, debugRef.current);
            if (!deleteResponse.ok) {
                enqueueSnackbar(
                    doI18n("pages:content:could_not_delete_remote", i18nRef.current),
                    {variant: "error"}
                )
            }
        }

        const addUrl = `/git/remote/add/${repo_path}?remote_name=origin&remote_url=${remoteUrlValue}`;
        const addResponse = await postEmptyJson(addUrl, debugRef.current);
        if (addResponse.ok) {
            enqueueSnackbar(
                doI18n("pages:content:remote_repo_added", i18nRef.current),
                {variant: "success"}
            );
            setReposModCount(reposModCount + 1);
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_add_remote_repo", i18nRef.current),
                {variant: "error"}
            );
        }
    }

    const repoBranches = async repo_path => {

        const branchesUrl = `/git/branches/${repo_path}`;
        const branchesResponse = await getJson(branchesUrl, debugRef.current);
        if (branchesResponse.ok) {
            setBranchList(branchesResponse.json.payload.branches);
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_fetch_branches", i18nRef.current),
                { variant: "error" }
            );
        }
    };

    const checkoutBranch = async (repo_path, branch) => {

        const branchUrl = `/git/branch/${branch}/${repo_path}`;
        const branchResponse = await postEmptyJson(branchUrl, debugRef.current);
        
        if (branchResponse.ok) {
            setReposModCount(reposModCount + 1);
            if (branchResponse.json.is_ok){
                enqueueSnackbar(
                    doI18n(`pages:content:branch_switched`, i18nRef.current),
                    { variant: "success" }
                );
            } else {
                enqueueSnackbar(
                    doI18n("pages:content:could_not_switch_branch", i18nRef.current),
                    { variant: "error" }
                );
            }
        } else {
            enqueueSnackbar(
                doI18n("pages:content:could_not_switch_branch", i18nRef.current),
                { variant: "error" }
            );
        }
    };

    useEffect(() => {
        repoBranches(repoInfo.path).then();
    },
    [reposModCount]);

    const handleRemoteUrlValidation = (e) => {
        setRemoteUrlValue(e.target.value);
    };

    const handleListItemClick = (event, index) => {
        setSelectedBranchIndex(index);
      };

      console.log(branchList);

    return <Dialog
        fullWidth={true}
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
        sx={{
            backdropFilter: "blur(3px)",
        }}
    >
        <AppBar color='secondary' sx={{ position: 'relative', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {doI18n("pages:content:remote_content", i18nRef.current)}
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent>
            <DialogContentText>
                <Typography variant="h6">
                    {repoInfo.name}
                </Typography>
                <Stack spacing={2} sx={{ m: 2 }}>
                    <TextField
                        id="repo-url"
                        label={doI18n("pages:content:remote_repo_url", i18nRef.current)}
                        value={remoteUrlValue}
                        variant="outlined"
                        onChange={(e) => handleRemoteUrlValidation(e)}
                        error={!remoteUrlRegex.test(remoteUrlValue)}
                        required={true}
                    />
                    <Typography variant="subtitle1">
                        {doI18n("pages:content:branches", i18nRef.current)}
                    </Typography>
                    <List component="nav" aria-label="dcs-branch-list">
                        {branchList.filter((branch) => !branch.name.includes("/")).map((branch, n) => {
                            return <ListItemButton
                                selected={/* selectedBranchIndex === n */branch.is_head === true}
                                /* disabled={} */
                                onClick={(event) => {
                                    if (branch.is_head === false) { checkoutBranch(repoInfo.path, branch.name).then() };
                                    handleListItemClick(event, n);  
                                }}
                            >
                                <ListItemIcon>
                                    {/* selectedBranchIndex === n */branch.is_head === true && <DoneIcon />}
                                </ListItemIcon>
                                <ListItemText primary={branch.name} />
                            </ListItemButton>
                        })}
                    </List>
                </Stack>
                <Typography>
                    {doI18n("pages:content:about_to_upload_content", i18nRef.current)}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn} color='primary'>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                autoFocus
                variant='contained'
                color="primary"
                disabled={remotes === null || !remoteUrlRegex.test(remoteUrlValue) || (remotes.filter((p) => p.name === "origin")[0]?.url === remoteUrlValue)}
                onClick={async () => {
                            await addRemoteRepo(repoInfo.path);
                            closeFn()
                        }}
            >
                {doI18n("pages:content:update", i18nRef.current)}
            </Button>
        </DialogActions>
    </Dialog>;
}

export default RemoteContent;