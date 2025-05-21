import {useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
    Box,
    DialogContent, DialogContentText
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';
import {i18nContext, doI18n} from "pithekos-lib";
import { useFilePicker } from 'use-file-picker';

export default function ImportBook({repoInfo, wrapperDialogOpen, setWrapperDialogOpen}) {

    const {i18nRef} = useContext(i18nContext);
    const { openFilePicker, filesContent, loading } = useFilePicker({
        accept: [".sfm", ".usfm", ".txt"],
    });
    const [fileExists, setFileExists] = useState(filesContent.length > 0 ? true : false);
    const bookIsUsfm = ((filesContent.length > 0) && (typeof filesContent[0].content === 'string') ) ? filesContent[0]?.content.startsWith("\\id ") : false;
    const bookIsDuplicate = bookIsUsfm ? repoInfo?.bookCodes.includes(filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1]): undefined;
    const importedBookCode = bookIsUsfm ? filesContent[0]?.content?.split("\n").filter((item) => item.startsWith("\\id "))[0].split(" ")[1] : undefined;

    useEffect(() => {
        if (filesContent.length > 0) {
            setFileExists(true)
        }
    }, [filesContent]) 

    const handleWrapperDialogClose = () => {
        setWrapperDialogOpen(false);
    };

    const fixUsfm = (usfm) => {
        return usfm
    };

    const postUsfm = (usfm) => {
        console.log(usfm[0].content)
    };

    const usfmDialogContent = (bookIsUsfm, bookIsDuplicate, fileExists, importedBookCode) => {
         if (fileExists){
            if (!bookIsUsfm) {
                return doI18n("pages:content:bad_usfm", i18nRef.current);
            }
            if (bookIsDuplicate){
                return doI18n("pages:content:book_exists", i18nRef.current);
            }
            return `${doI18n("pages:content:usfm_for_book", i18nRef.current)} ${importedBookCode}.`
        }
    };

    return (
        <Dialog fullScreen open={wrapperDialogOpen} onClose={handleWrapperDialogClose} >
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
                        onClick={() => { fixUsfm(filesContent); postUsfm(filesContent) }}
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
                    <Box>Loading...</Box> 
                :
                    <Box>
                        <Typography>{doI18n("pages:content:select_file_title", i18nRef.current)}</Typography>
                        <Button variant="outlined" size="small" onClick={() => openFilePicker()}>{doI18n("pages:content:select_file", i18nRef.current)}</Button>
                        <br />
                        <DialogContentText>
                            <Typography>
                                {usfmDialogContent(bookIsUsfm, bookIsDuplicate, fileExists, importedBookCode)}
                            </Typography>
                            <br/>
                            {(importedBookCode && bookIsUsfm && !bookIsDuplicate)
                                && 
                                filesContent?.map((file, index) => (
                                    <Box key={index}>
                                        <Typography variant="h2">{file.name}</Typography>
                                        <Box key={index}>{file.content
                                            ?.split("\n")
                                            .filter(item => ["\\id ", "\\h", "\\toc", "\\toc1", "\\toc2", "\\toc3", "\\mt"].some( word => item.startsWith(word)))
                                            .map((c) => <Box>{c}</Box>)}
                                        </Box>
                                        <br />
                                    </Box>
                                ))}
                        </DialogContentText>
                    </Box>
            }
            </DialogContent>
        </Dialog>
    );
}