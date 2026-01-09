import { DialogContent, DialogContentText } from "@mui/material";
import { PanDialog } from "pankosmia-rcl";
import { doI18n, i18nContext } from "pithekos-lib";
import { useContext } from "react";

export default function AboutRepo({ repoInfo, open, closeFn }) {

    const { i18nRef } = useContext(i18nContext);

    return <PanDialog
        titleLabel={`${doI18n("pages:content:about_document", i18nRef.current)} ${repoInfo.source} - ${repoInfo.abbreviation} `}
        isOpen={open}
        closeFn={() => closeFn()}>
        <DialogContent>
            {repoInfo ? Object.entries(repoInfo).map(([key, value]) => {
                const keys = repoInfo.name === repoInfo.description ? ["name", "flavor", "dateUpdated", "language_code", "book_codes"] : ["name", "description", "flavor", "dateUpdated", "language_code", "book_codes"]
                if (!keys.includes(key)) return null;
                return (
                    <DialogContentText
                        variant={key === "name" ? "h6" : "body2"}
                        key={key}
                        sx={{
                            fontWeight: key === "name" ? "bold" : "normal",
                            fontStyle: key === "description" ? "italic" : "normal",
                            mb: 1
                        }}
                    >
                        {key === 'flavor' ? (`${doI18n("pages:content:about_repo_flavor", i18nRef.current)} : ${value}`) : null}
                        {key === 'language_code' ? (`${doI18n("pages:content:about_repo_language-code", i18nRef.current)} : ${value}`) : null}
                        {key === 'dateUpdated' ? (`${doI18n("pages:content:about_repo_dateUdapted", i18nRef.current)} : ${value}`) : null}
                        {key === 'book_codes' && Array.isArray(value) ? (`${doI18n("pages:content:book_or_books", i18nRef.current)} : ${value.join(", ")}`) : null}
                        {key === 'name' ? (`${value}`) : null}
                        {key === 'description' ? (`${value}`) : null}
                    </DialogContentText>
                );
            }) : null}
        </DialogContent>
    </PanDialog>
}