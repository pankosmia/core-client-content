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

export default function ImportBook({repoInfo, open, setOpen/* , reposModCount, setReposModCount */}) {

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

  

    const handleClose = () => {
        setOpen(false);
    };

    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const [bookCodes, setBookCodes] = useState([]);
    const [duplicatedBook, setDuplicatedBook] = useState(false);

/*     const [protestantOnly, setProtestantOnly] = useState(true); */
    const { openFilePicker, filesContent, loading } = useFilePicker({
        accept: [".sfm", ".usfm", ".txt"],
    });

    useEffect(() => {
        if (filesContent.length === 0) {
            return
        }
        if (repoInfo.bookCodes.includes(filesContent[0].content.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1])){
            setDuplicatedBook(true);
        } else {
            setDuplicatedBook(false);
        }
    }, [filesContent])

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
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
                    {filesContent.map((file, index) => (
                    <div key={index}>
                        <h2>{file.name}</h2>
                        <div key={index}>{file.content
                            .split("\n")
                            .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                            .map((c) => {
                            if (duplicatedBook) {
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
                    ))}
                </div>
            }
            </DialogContent>
        </Dialog>
    );
}