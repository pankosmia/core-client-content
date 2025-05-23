import {useContext} from 'react';
import {Box, Grid2, IconButton, Stack} from "@mui/material";
import {i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import dateFormat from 'dateformat';
import ContentRowButtonPlusMenu from "./ContentRowButtonPlusMenu";

const flavorTypes = {
    textTranslation: "scripture",
    "x-bcvNotes": "parascriptural",
    "x-bcvArticles": "parascriptural",
    "x-bcvQuestions": "parascriptural",
    "x-bcvImages": "parascriptural"
};

function ContentRow({repoInfo, reposModCount, setReposModCount}) {
    const {i18nRef} = useContext(i18nContext);
    return <>
        <Grid2 item size={4} sx={{backgroundColor: "#FFF"}}>
            <Stack>
                <Box><b>{`${repoInfo.name} (${repoInfo.abbreviation})`}</b></Box>
                {repoInfo.description !== repoInfo.name &&
                    <Box>{repoInfo.description}</Box>
                }
            </Stack>
        </Grid2>
        <Grid2 item size={1} sx={{backgroundColor: "#FFF"}}>
            {repoInfo.language_code}
        </Grid2>
        <Grid2 item size={1} sx={{backgroundColor: "#FFF"}}>
            {`${repoInfo.bookCodes.length} ${doI18n("pages:content:book_or_books", i18nRef.current)}`}
        </Grid2>
        <Grid2 item size={2} sx={{backgroundColor: "#FFF"}}>
            {
                flavorTypes[repoInfo.flavor] ?
                    doI18n(`flavors:names:${flavorTypes[repoInfo.flavor]}/${repoInfo.flavor}`, i18nRef.current) :
                    repoInfo.flavor
            }
        </Grid2>
        <Grid2 item size={2} sx={{backgroundColor: "#FFF"}}>
            {
                repoInfo.path.startsWith("_local_") ?
                    doI18n("pages:content:local_org", i18nRef.current) :
                    `${repoInfo.path.split("/")[1]} (${repoInfo.path.split("/")[0]})`
            }
        </Grid2>
        <Grid2 item size={1} sx={{backgroundColor: "#FFF"}}>
            {dateFormat(repoInfo.generated_date, "mmm d yyyy")}
        </Grid2>
        <Grid2 item size={1} display="flex"
               justifyContent="flex-end" alignItems="center"
               sx={{backgroundColor: "#FFF"}}>
            {
                repoInfo.path.startsWith("_local_") ?
                    <IconButton
                        onClick={
                            async () => {
                                await postEmptyJson(`/navigation/bcv/${repoInfo.bookCodes[0]}/1/1`);
                                await postEmptyJson(`/app-state/current-project/${repoInfo.path}`);
                                window.location.href = "/clients/local-projects";
                            }
                        }
                    >
                        <EditIcon/>
                    </IconButton> :
                    <IconButton disabled={true}>
                        <EditOffIcon/>
                    </IconButton>
            }
            <ContentRowButtonPlusMenu
                repoInfo={repoInfo}
                reposModCount={reposModCount}
                setReposModCount={setReposModCount}
            />
        </Grid2>
    </>

}

export default ContentRow;