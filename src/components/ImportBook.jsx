import {useState, useContext, useEffect} from 'react';
import {
    AppBar,
    Button, Checkbox,
    Dialog, FormControl, FormControlLabel, FormGroup,
    IconButton,
    Stack,
    TextField,
    Toolbar,
    Typography,
    Select,
    MenuItem,
    InputLabel, Grid2, DialogContent, DialogContentText, DialogTitle, DialogActions
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {enqueueSnackbar} from "notistack";
import {i18nContext, debugContext, postJson, doI18n, getJson} from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";
import { useFilePicker } from 'use-file-picker';

export default function ImportBook({repoInfo, wrapperDialogOpen, setWrapperDialogOpen/* , reposModCount, setReposModCount */}) {

    const [addCV, setAddCV] = useState(false);
    const [bookCode, setBookCode] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookAbbr, setBookAbbr] = useState("");

    useEffect(
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
    );

    const handleWrapperDialogClose = () => {
        setWrapperDialogOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [bookCodes, setBookCodes] = useState([]);

/*     const [protestantOnly, setProtestantOnly] = useState(true); */
    const { openFilePicker, filesContent, loading } = useFilePicker({
        accept: [".sfm", ".usfm", ".txt"],
    });

/*     useEffect(() => {
        if (filesContent.length === 0) {
            return
        }
        setDuplicatedBook(repoInfo.bookCodes.includes(filesContent[0].content.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1]));
    }, [filesContent]) */

    const importedBookCode = filesContent ? filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1] : undefined;

    const importedBookContent = filesContent.map((file, index) => (
                    <div key={index}>
                        <h2>{file.name}</h2>
                        <div key={index}>{file.content
                            .split("\n")
                            .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                            .map((c) =><div>{c}</div>
                        )}</div>
                        <br />
                    </div>
                    ));
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

    const [fileExists, setFileExists] = useState((filesContent.length > 0) ? true : false);
    const [openUsfmDialog, setOpenUsfmDialog] = useState(false);

    useEffect(() => {
        if (filesContent.length > 0) {
            setOpenUsfmDialog(true)
        }
    }, [filesContent])

    const handleUsfmDialogOpen = (fileExists) => {
        if (fileExists){
            setOpenUsfmDialog(true);
        }
    };

    const handleUsfmDialogClose = () => {
        setOpenUsfmDialog(false);
    };

    const bookIsUsfm = filesContent.length > 0 ? filesContent[0]?.content.startsWith("\\id ") : false;

    const bookIsDuplicate = bookIsUsfm ? repoInfo?.bookCodes.includes(filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1]): undefined;

    const fixUsfm = (usfm) => {
        return usfm
    };

    const postUsfm = (usfm) => {
        console.log(usfm)
    };

    const usfmDialogContent = (bookIsUsfm, bookIsDuplicate, filesContent, importedBookCode) => {
         if (filesContent){
            if (!bookIsUsfm) {
                return `Bad USFM, please try again.`;
            }
            if (bookIsDuplicate){
                return `Book already exists, please delete existing one and try again.`;
            }
            return `Usfm for book ${importedBookCode}.`
        } 
    };

    console.log(bookIsDuplicate);
    
    // HACER LAS CONDICIONES PARA EL BOTON Y AVERIGUAR COMO VOY A HACER PARA QUE EL BOTON DE SUBIR EL ARCHIVO ABRA EL DIALOGO, DEBE TENER ALGO QUE VER CON UNO DE LOS ESTADOS DEL USEFILE HOOK, ME IMAGINO QUE ES EL FILECONTENT, PROBAR SI EL DIALOG QUE HICE FUNCIONA Y BUENO SEGUIR POR AHI

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
                        onClick={handleWrapperDialogClose}
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
/*                         disabled={
                            !(
                                bookCode.trim().length === 3 &&
                                bookTitle.trim().length > 0 &&
                                bookAbbr.trim().length > 0
                            )
                        } */
                        onClick={() => console.log("handleCreate")}
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
                    <div>
                    <button onClick={() => openFilePicker()}>Select files</button>
                    <br />
                    <Dialog open={openUsfmDialog} onClose={handleUsfmDialogClose} slotProps={{ paper: { component: 'form' } }} >
                        <DialogTitle><b>{doI18n("pages:content:upload_book", i18nRef.current)}</b></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography>
                                     {usfmDialogContent(bookIsUsfm, bookIsDuplicate, filesContent, importedBookCode)}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setFileExists(false); handleUsfmDialogClose(); }}>{doI18n("pages:content:cancel", i18nRef.current)}</Button>
                            <Button disabled={(!bookIsUsfm || bookIsDuplicate)} onClick={() => { fixUsfm(usfmFile); postUsfm(filesContent); handleUsfmDialogClose() }}>{doI18n("pages:content:accept", i18nRef.current)}</Button>
                        </DialogActions>
                    </Dialog>
                    {/* {filesContent.map((file, index) => (
                    <div key={index}>
                        <h2>{file.name}</h2>
                        <div key={index}>{file.content
                            .split("\n")
                            .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                            .map((c) => {
                            if (bookIsDuplicate(repoInfo, filesContent)) {
                                return <div>
                                    <h3>This book already exists</h3>
                                </div>
                            }
                            return <div>
                                        {c}
                                   </div>
                        })}</div>
                        <br />
                    </div>
                    ))} */}
                </div>
            }
            </DialogContent>
        </Dialog>
    );
}