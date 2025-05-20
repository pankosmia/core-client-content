import {useState, useContext, useEffect} from 'react';
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
    Box,
    DialogContent, DialogContentText, DialogTitle, DialogActions
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {i18nContext, debugContext, doI18n, getJson} from "pithekos-lib";
import { useFilePicker } from 'use-file-picker';

export default function ImportBook({repoInfo, wrapperDialogOpen, setWrapperDialogOpen/* , reposModCount, setReposModCount */}) {

/*     const [addCV, setAddCV] = useState(false);
    const [bookCode, setBookCode] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookAbbr, setBookAbbr] = useState(""); */
    const {i18nRef} = useContext(i18nContext);
/*     const {debugRef} = useContext(debugContext);
    const [bookCodes, setBookCodes] = useState([]); */
    const { openFilePicker, filesContent, loading } = useFilePicker({
        accept: [".sfm", ".usfm", ".txt"],
    });
    const [fileExists, setFileExists] = useState((filesContent.length > 0) ? true : false);
/*     const [openUsfmDialog, setOpenUsfmDialog] = useState(false); */
    const bookIsUsfm = ((filesContent.length > 0) && (typeof filesContent[0].content === 'string') ) ? filesContent[0]?.content.startsWith("\\id ") : false;
    const bookIsDuplicate = bookIsUsfm ? repoInfo?.bookCodes.includes(filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1]): undefined;
    const importedBookCode = bookIsUsfm ? filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1] : undefined;
    
/*     const importedBookContent = filesContent.map((file, index) => (
        <div key={index}>
            <h2>{file.name}</h2>
            <div key={index}>{file.content
                .split("\n")
                .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                .map((c) =><div>{c}</div>
            )}</div>
            <br />
        </div>
        )); */

const usfmFile = filesContent?.map((file, index) => (
        <div key={index}>
            <h2>{file.name}</h2>
            <div key={index}>{file.content
                ?.split("\n")
                .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                .map((c) => {
                return <div>{c}</div>
                })}
            </div>
            <br />
        </div>
        ));

/*     useEffect(
        () => {
            const doFetch = async () => {
                const versificationResponse = await getJson("/content-utils/versification/eng", debugRef.current);
                if (versificationResponse.ok) {
                    const newBookCodes = Object.keys(versificationResponse.json.maxVerses);
                    setBookCodes(newBookCodes);
                }
                setBookCode("");
                setBookTitle("");
                setBookAbbr("");
            };
            doFetch().then();
        },
        [wrapperDialogOpen, repoInfo]
    ); */

    const handleWrapperDialogClose = () => {
        setWrapperDialogOpen(false);
    };

/*     useEffect(() => {
        if (filesContent.length > 0) {
            setOpenUsfmDialog(true)
        }
    }, [filesContent]) */

/*     const handleUsfmDialogOpen = (fileExists) => {
        if (fileExists){
            setOpenUsfmDialog(true);
        }
    };

    const handleUsfmDialogClose = () => {
        setOpenUsfmDialog(false);
    };
 */
    const fixUsfm = (usfm) => {
        return usfm
    };

    const postUsfm = (usfm) => {
        console.log(usfm[0].content)
    };

    const usfmDialogContent = (bookIsUsfm, bookIsDuplicate, filesContent, importedBookCode) => {
         if (filesContent){
            if (!bookIsUsfm) {
                return doI18n("pages:content:bad_usfm", i18nRef.current);
            }
            if (bookIsDuplicate){
                return doI18n("pages:content:book_exists", i18nRef.current);
            }
            return `${doI18n("pages:content:usfm_for_book", i18nRef.current)} ${importedBookCode}.`
        } else {
            return doI18n("pages:content:select_file", i18nRef.current)
        }
    };

    return (
        <Dialog
            fullScreen
            open={wrapperDialogOpen}
            onClose={handleWrapperDialogClose}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {setFileExists(false); handleWrapperDialogClose()}}
                        aria-label={doI18n("pages:content:close", i18nRef.current)}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        {doI18n("pages:content:import_book", i18nRef.current)}
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={() => { fixUsfm(usfmFile); postUsfm(filesContent); handleUsfmDialogClose() }}
                        disabled={(!fileExists || !bookIsUsfm || bookIsDuplicate)}
                    >
                        {doI18n("pages:content:import", i18nRef.current)}
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent>
            {
                    loading 
                ? 
                    <div>Loading...</div> 
                :
                    <Box>
                        <Typography>{doI18n("pages:content:select_file_title", i18nRef.current)}</Typography>
                        <Button onClick={() => openFilePicker()}>{doI18n("pages:content:select_file", i18nRef.current)}</Button>
                        <br />
                        <DialogContentText>
                            <Typography>
                                {usfmDialogContent(bookIsUsfm, bookIsDuplicate, filesContent, importedBookCode)}
                            </Typography>
                            <br/>
                            <Typography>
                                {usfmFile}
                            </Typography>
                        </DialogContentText>
                       {/*  <Dialog open={openUsfmDialog} onClose={handleUsfmDialogClose} slotProps={{ paper: { component: 'form' } }} >
                            <DialogTitle><b>{doI18n("pages:content:upload_book", i18nRef.current)}</b></DialogTitle>
                            <DialogActions>
                                <Button onClick={() => { setFileExists(false); handleUsfmDialogClose(); }}>{doI18n("pages:content:cancel", i18nRef.current)}</Button>
                                <Button disabled={(!fileExists || !bookIsUsfm || bookIsDuplicate)} onClick={() => { fixUsfm(usfmFile); postUsfm(filesContent); handleUsfmDialogClose() }}>{doI18n("pages:content:accept", i18nRef.current)}</Button>
                            </DialogActions>
                        </Dialog> */}
                    </Box>
            }
            </DialogContent>
        </Dialog>
    );
}