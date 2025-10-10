import { useDetectDir } from "font-detect-rhl";

function TextDir(pdfHtml) {
    const markupScope = {
      regex: [/<[^>]+>/gm], // Remove all html code
    };
    const useDetectDirProps = { text: pdfHtml, ratioThreshold: 0.51, isMarkup: true, markupScope: markupScope };
    const textDir = useDetectDir( useDetectDirProps );

    return textDir;
}

export default TextDir;