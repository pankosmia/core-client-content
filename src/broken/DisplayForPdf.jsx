import {useState} from 'react'

import {
    useUsfmPreviewRenderer,
    renderStyles as renderStylesLtr,
    renderStylesRtl
} from "@oce-editor-tools/base";
import { PrintDrawer } from '@oce-editor-tools/mui-core';
import DOMPurify from 'dompurify'
import { useDetectDir } from 'font-detect-rhl'



function DisplayForPdf ({usfmText}) {
    const useDetectDirProps = { text: usfmText, ratioThreshold: 0.5, isMarkup: true };

    const textDir = useDetectDir( useDetectDirProps );

    const renderStyles = (textDir === 'ltr' ? renderStylesLtr : renderStylesRtl);

    const [isOpen,setIsOpen] = useState(false)

    const handleClick = () => setIsOpen(!isOpen)

    const renderFlags = {
        showWordAtts: false,
        showTitles: true,
        showHeadings: true,
        showIntroductions: true,
        showFootnotes: false,
        showXrefs: false,
        showParaStyles: true,
        showCharacterMarkup: false,
        showChapterLabels: true,
        showVersesLabels: true,
    }

    const { renderedData, ready } = useUsfmPreviewRenderer({
        usfmText,
        renderFlags,
        htmlRender: true,
        renderStyles,
    })

    const pagedJsSource = `https://unpkg.com/pagedjs/dist/paged.polyfill.js`;

    const openNewWindow = true;

    const displayFont = 'sans-serif';
    const displayFontSize = '100%';
    const displayLineHeight = '1.13';

    const previewProps = {
        openPrintDrawer: isOpen && ready,
        onClosePrintDrawer: () => {
            setIsOpen(false)
        },
        onRenderContent: () => renderedData,
        canChangeAtts: false,
        canChangeColumns: true,
        pagedJsSource: pagedJsSource,
        printFont: displayFont,
        printFontSize: displayFontSize,
        printLineHeight: displayLineHeight,
        openNewWindow: openNewWindow,
    }

    return (
        <div key="1" style={{ fontFamily: displayFont, fontSize: displayFontSize, lineHeight: displayLineHeight }}>
            { ready && (<button onClick={handleClick}>
                Print preview
            </button>)}
            { ready ? <PrintDrawer {...previewProps} /> : 'Loading...'}
            { ready && (<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(renderedData)}}/>)}
        </div>
    )
}
export default DisplayForPdf;