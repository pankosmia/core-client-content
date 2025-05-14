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
    InputLabel, Grid2, DialogContent
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {enqueueSnackbar} from "notistack";
import {i18nContext, debugContext, postJson, doI18n, getJson} from "pithekos-lib";
import sx from "./Selection.styles";
import ListMenuItem from "./ListMenuItem";
import { useFilePicker } from 'use-file-picker';

export default function ImportBook({repoInfo, open, setWrapperDialogOpen/* , reposModCount, setReposModCount */}) {

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
        [open, repoInfo]
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

    const importedBookCode = filesContent ? filesContent[0].content.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1] : undefined;

    const bookIsUsfm = (uploadedContent) => {
        return uploadedContent[0].startsWith("\\id ")
    };

    const bookIsDuplicate = (currentBookCodes, uploadedContent) => {
        return currentBookCodes.bookCodes.includes(uploadedContent[0].content.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1])
    };

    const fixUsfm = (usfm) => {
        return usfm
    };

    const postUsfm = (usfm) => {
        console.log(usfm)
    };

    const usfmDialogContent = (bookIsUsfm, bookIsDuplicate, importedBookCode) => {
        if (importedBookCode){
            if (!bookIsUsfm) {
                return <Typography>Bad USFM, please try again</Typography>;
            }
            if (bookIsDuplicate){
                return <Typography>Book already exists, please delete existing one and try again</Typography>;
            }
            return <Typography>{`Usfm for book ${importedBookCode}`}</Typography>
        }
    }

    // HACER LAS CONDICIONES PARA EL BOTON Y AVERIGUAR COMO VOY A HACER PARA QUE EL BOTON DE SUBIR EL ARCHIVO ABRA EL DIALOGO, DEBE TENER ALGO QUE VER CON UNO DE LOS ESTADOS DEL USEFILE HOOK, ME IMAGINO QUE ES EL FILECONTENT, PROBAR SI EL DIALOG QUE HICE FUNCIONA Y BUENO SEGUIR POR AHI

    return (
        <Dialog
            fullScreen
            open={open}
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
                    <Dialog open={open} onClose={handleClose} slotProps={{ paper: { component: 'form' } }} >
                        <DialogTitle><b>{doI18n("pages:content:upload_book", i18nRef.current)}</b></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {usfmDialogContent(bookIsUsfm, bookIsDuplicate, importedBookCode)}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>{doI18n("pages:content:cancel", i18nRef.current)}</Button>
                            <Button onClick={() => { setInternet(true); handleClose() }}>{doI18n("pages:content:accept", i18nRef.current)}</Button>
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