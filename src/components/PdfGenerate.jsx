import {useRef, useContext, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    Menu,
    MenuItem,
    OutlinedInput,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    IconButton
} from "@mui/material";
import {Proskomma} from 'proskomma-core';
import {SofriaRenderFromProskomma, render} from "proskomma-json-tools";
import {getText, debugContext, i18nContext, doI18n, typographyContext} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import { useAssumeGraphite } from "font-detect-rhl";

function PdfGenerate({bookNames, repoSourcePath, open, closeFn}) {

    const { typographyRef } = useContext(typographyContext);
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState(2);
    const [showTitles, setShowTitles] = useState(true);

    const isFirefox = useAssumeGraphite({});

    const generatePdf = async bookCode => {
        const pdfTemplate = `

<section style="page-break-inside: avoid">
%%BODY%%
</section>
`;
        const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
        const bookUsfmResponse = await getText(bookUrl, debugRef.current);
        if (!bookUsfmResponse.ok) {
            enqueueSnackbar(
                `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                {variant: "error"}
            );
            return false;
        }
        const sectionConfig = {
            "showWordAtts": false,
            "showTitles": showTitles,
            "showHeadings": true,
            "showIntroductions": true,
            "showFootnotes": false,
            "showXrefs": false,
            "showParaStyles": true,
            "showCharacterMarkup": true,
            "showChapterLabels": true,
            "showVersesLabels": true,
            "showFirstVerseLabel": true,
            "nColumns": selectedColumns,
            "showGlossaryStar": false
        }
        const pk = new Proskomma();
        pk.importDocument({
                lang: "xxx",
                abbr: "yyy"
            },
            "usfm",
            bookUsfmResponse.text
        );
        const docId = pk.gqlQuerySync('{documents { id } }').data.documents[0].id;
        const actions = render.sofria2web.renderActions.sofria2WebActions;
        const renderers = render.sofria2web.sofria2html.renderers;
        const cl = new SofriaRenderFromProskomma({proskomma: pk, actions, debugLevel: 0})
        const output = {};
        sectionConfig.selectedBcvNotes = ["foo"];
        sectionConfig.renderers = renderers;
        sectionConfig.renderers.verses_label = vn => {
            return `<span class="marks_verses_label">${vn}</span>`;
        };
        cl.renderDocument({docId, config: sectionConfig, output});
        const pdfHtml = pdfTemplate.replace("%%BODY%%", output.paras);
        const newPage = isFirefox ? window.open("", "_self") : window.open('about:blank', '_blank');
        const server = window.location.origin;
        if (!isFirefox) newPage.document.body.innerHTML = `<div class="${typographyRef.current.font_set}">${pdfHtml}</div>`
        isFirefox && newPage.document.write(`<div class="${typographyRef.current.font_set}">${pdfHtml}</div>`);  
        newPage.document.head.innerHTML = '<title>PDF Preview</title>'
        const script = document.createElement('script')
        script.src = `${server}/app-resources/pdf/paged.polyfill.js`;
        newPage.document.head.appendChild(script)
        const fontSetLink = document.createElement('link');
        fontSetLink.rel="stylesheet";
        fontSetLink.href="/webfonts/_webfonts.css";
        newPage.document.head.appendChild(fontSetLink);
        const link = document.createElement('link');
        link.rel="stylesheet";
        link.href = `${server}/app-resources/pdf/para_bible_page_styles.css`;
        newPage.document.head.appendChild(link)
        return true;
    }

    const handleBooksChange = (event) => {
        setSelectedBooks(event.target.value);
    };
    
    const [anchorEl, setAnchorEl] = useState(null);
    const openAnchor = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <Dialog
        open={open}
        onClose={closeFn}
        slotProps={{
            paper: {
                component: 'form',
            },
        }}
    >
        <DialogTitle><b>{doI18n("pages:content:generate_as_pdf", i18nRef.current)}</b></DialogTitle>
        <DialogContent>
            <Select
                variant="standard"
                displayEmpty
                value={selectedBooks}
                onChange={handleBooksChange}
                input={<OutlinedInput/>}
                renderValue={selected => {
                    if (!selected) {
                        return <em>{doI18n("pages:content:books", i18nRef.current)}</em>;
                    }
                    fileExport.current = selected;
                    return selected;
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 224,
                            width: 250,
                        },
                    }
                }}
                inputProps={{'aria-label': 'Without label'}}
            >
                <MenuItem disabled value="">
                    <em>{doI18n("pages:content:books", i18nRef.current)}</em>
                </MenuItem>
                {bookNames.map((bookName) => (
                    <MenuItem
                        key={bookName}
                        value={bookName}
                    >
                        {doI18n(`scripture:books:${bookName}`, i18nRef.current)}
                    </MenuItem>
                ))}
            </Select>
            {!selectedBooks 
            ?
                <DialogContentText>
                    <Typography>
                        {doI18n("pages:content:pick_one_book_export", i18nRef.current)}
                    </Typography>
                </DialogContentText>
            :
                <DialogContentText>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem
                            disablePadding
                            >
                            <ListItemButton onClick={() => setShowTitles(!showTitles)} dense>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={showTitles}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                </ListItemIcon>
                                <ListItemText primary={`Show title`} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <Button
                                id="basic-button"
                                aria-controls={openAnchor ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openAnchor ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                Columns({selectedColumns})
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openAnchor}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {setSelectedColumns(1); handleClose()}}>1</MenuItem>
                                <MenuItem onClick={() => {setSelectedColumns(2); handleClose()}}>2</MenuItem>
                                <MenuItem onClick={() => {setSelectedColumns(3); handleClose()}}>3</MenuItem>
                            </Menu>
                        </ListItem>
                    </List>
                </DialogContentText>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={closeFn}>
                {doI18n("pages:content:cancel", i18nRef.current)}
            </Button>
            <Button
                onClick={() => {
                    if (!fileExport.current) {
                        enqueueSnackbar(
                            doI18n("pages:content:no_books_selected", i18nRef.current),
                            {variant: "warning"}
                        );
                    } else {
                        generatePdf(fileExport.current).then();
                    }
                    closeFn();
                }}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PdfGenerate;
