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
    Switch
} from "@mui/material";
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined';
import {Proskomma} from 'proskomma-core';
import {SofriaRenderFromProskomma, render} from "proskomma-json-tools";
import {getText, debugContext, i18nContext, doI18n, typographyContext} from "pithekos-lib";
import {enqueueSnackbar} from "notistack";
import { useAssumeGraphite } from "font-detect-rhl";
import {getCVTexts, getBookName} from "../helpers/cv";
import GraphiteTest from './GraphiteTest';

function PdfGenerate({bookNames, repoSourcePath, open, closeFn}) {

    const { typographyRef } = useContext(typographyContext);
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const fileExport = useRef();
    const [selectedBooks, setSelectedBooks] = useState(null);
    const [showByVerse, setShowByVerse] = useState(false);

    const [showTitles, setShowTitles] = useState(true);
    const [showHeadings, setShowHeadings] = useState(true);
    const [showIntroductions, setShowIntroductions] = useState(true);
    const [showFootnotes, setShowFootnotes] = useState(false);
    const [showXrefs, setShowXrefs] = useState(false);
    const [showParaStyles, setShowParaStyles] = useState(true);
    const [showCharacterMarkup, setShowCharacterMarkup] = useState(true);
    const [showChapterLabels, setShowChapterLabels] = useState(true);
    const [showVersesLabels, setShowVersesLabels] = useState(true);
    const [showFirstVerseLabel, setShowFirstVerseLabel] = useState(true);
    const [selectedColumns, setSelectedColumns] = useState(2);


    const isFirefox = useAssumeGraphite({});

    const isGraphite = GraphiteTest()
    /** adjSelectedFontClass reshapes selectedFontClass if Graphite is absent. */
    const adjSelectedFontClass = isGraphite ? typographyRef.current.font_set : typographyRef.current.font_set.replace(/Pankosmia-AwamiNastaliq(.*)Pankosmia-NotoNastaliqUrdu/ig, 'Pankosmia-NotoNastaliqUrdu');

    const generatePdf = async (bookCode, pdfType="para") => {
        let pdfHtml;
        if (pdfType === "para") {
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
                "showHeadings": showHeadings,
                "showIntroductions": showIntroductions,
                "showFootnotes": showFootnotes,
                "showXrefs": showXrefs,
                "showParaStyles": showParaStyles,
                "showCharacterMarkup": showCharacterMarkup,
                "showChapterLabels": showChapterLabels,
                "showVersesLabels": showVersesLabels,
                "showFirstVerseLabel": showFirstVerseLabel,
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
            pdfHtml = pdfTemplate.replace("%%BODY%%", output.paras);
        } else if (pdfType === "bcv") {
            const bcvBibleVerseTemplate = `<section class="verseRecord">
    <span class="cvCol">
        %%CV%%
    </span>
    <span class="verseContent">
        %%VERSECONTENT%%
    </span>
</section>`;
            const bcvBibleTemplate = `%%BODY%%`;
            const bookUrl = `/burrito/ingredient/raw/${repoSourcePath}?ipath=${bookCode}.usfm`;
            const bookUsfmResponse = await getText(bookUrl, debugRef.current);
            if (!bookUsfmResponse.ok) {
                enqueueSnackbar(
                    `${doI18n("pages:content:could_not_fetch", i18nRef.current)} ${bookCode}`,
                    {variant: "error"}
                );
                return false;
            }
            const pk = new Proskomma();
            pk.importDocument({
                    lang: "xxx",
                    abbr: "yyy"
                },
                "usfm",
                bookUsfmResponse.text
            );
            const bookName = getBookName(pk, "xxx_yyy", bookCode);
            const cvTexts = getCVTexts(bookCode, pk);
            const verses = [`<h1>${bookName}</h1>`];
            const seenCvs = new Set([]);
            for (const cvRecord of cvTexts) {
                if (seenCvs.has(cvRecord.cv)) {
                    continue;
                } else {
                    seenCvs.add(cvRecord.cv);
                }
                const chapterVerseSeparator = ":";
                const verseRangeSeparator = "-";
                const verseHtml = bcvBibleVerseTemplate
                    .replace(
                        "%%CV%%",
                        cvRecord.cv
                            .replace(/(\d):/, (match, p1) => `${p1}${chapterVerseSeparator}`)
                            .replace(/(\d)-/, (match, p1) => `${p1}${verseRangeSeparator}`))
                    .replace(
                        '%%VERSECONTENT%%',
                        cvRecord.texts["xxx_yyy"] || "-"
                    );
                verses.push(verseHtml);
            }
            pdfHtml = bcvBibleTemplate
                .replace(
                    "%%TITLE%%",
                    `PDF`
                )
                .replace(
                    "%%BODY%%",
                    verses.join('\n')
                )
                .replace(
                    "%%BOOKNAME%%",
                    bookName
                )
        } else {
            throw new Error(`Unexpected pdfType '${pdfType}'`);
        }
        const newPage = isFirefox ? window.open("", "_self") : window.open('about:blank', '_blank');
        const server = window.location.origin;
        if (!isFirefox) newPage.document.body.innerHTML = `<div class="${adjSelectedFontClass}">${pdfHtml}</div>`
        isFirefox && newPage.document.write(`<div class="${adjSelectedFontClass}">${pdfHtml}</div>`);  
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
        link.href = pdfType === "para" ? `${server}/app-resources/pdf/para_bible_page_styles.css` : `${server}/app-resources/pdf/bcv_bible_page_styles.css`;
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

    function columnIcon( selectedColumns ) {
        let content;
        console.log('column update');
      
        switch (selectedColumns) {
          case 1:
            content = <LooksOneOutlinedIcon color='primary' />;
            break;
          case 2:
            content = <LooksTwoOutlinedIcon color='primary' />;
            break;
          case 3:
            content = <Looks3OutlinedIcon color='primary' />;
            break;
          default:
            content = <LooksTwoOutlinedIcon color='primary' />;
        }
      
        return content;
      }

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
                    return doI18n(`scripture:books:${selected}`, i18nRef.current);
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
                        <ListItem disablePadding >
                            <ListItemIcon>
                                <ViewHeadlineOutlinedIcon color='primary' />
                            </ListItemIcon>
                            <ListItemText primary={doI18n("pages:content:show_by_verse", i18nRef.current)} />
                            <Switch
                                edge='end'
                                onChange={() => setShowByVerse(!showByVerse)}
                                checked={showByVerse}
                            >
                            </Switch>
                        </ListItem>
                    {!showByVerse 
                        ?
                            <>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowTitles(!showTitles)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showTitles} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_title", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowHeadings(!showHeadings)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showHeadings} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_headings", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowIntroductions(!showIntroductions)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showIntroductions} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_introductions", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowFootnotes(!showFootnotes)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showFootnotes} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_footnotes", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowXrefs(!showXrefs)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showXrefs} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_xrefs", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowParaStyles(!showParaStyles)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showParaStyles} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_para_styles", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowCharacterMarkup(!showCharacterMarkup)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showCharacterMarkup} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_character_markup", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowChapterLabels(!showChapterLabels)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showChapterLabels} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_chapter_labels", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowVersesLabels(!showVersesLabels)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showVersesLabels} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_verses_labels", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton onClick={() => setShowFirstVerseLabel(!showFirstVerseLabel)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={showFirstVerseLabel} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:show_first_verse_label", i18nRef.current)} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding >
                                    <ListItemButton
                                        id="basic-button"
                                        aria-controls={openAnchor ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openAnchor ? 'true' : undefined}
                                        onClick={handleClick}
                                        dense
                                    >
                                        <ListItemIcon>{columnIcon(selectedColumns)}</ListItemIcon>
                                        <ListItemText primary={doI18n("pages:content:number_of_columns", i18nRef.current)} />
                                    </ListItemButton>
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
                            </>
                        :
                            <>
                                <ListItem disablePadding >
                                </ListItem>
                            </>
                    }
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
                        generatePdf(fileExport.current, showByVerse ? "bcv" : "para").then();
                    }
                    closeFn();
                }}
            >{doI18n("pages:content:export_label", i18nRef.current)}</Button>
        </DialogActions>
    </Dialog>;
}

export default PdfGenerate;
