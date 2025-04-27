import {useContext} from 'react';
import {Box, Grid2, IconButton, Stack} from "@mui/material";
import {i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import dateFormat from 'dateformat';
import ContentRowButtonPlusMenu from "./ContentRowButtonPlusMenu";

function ContentRow({repoInfo}) {
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
            {repoInfo.flavor}
        </Grid2>
        <Grid2 item size={2} sx={{backgroundColor: "#FFF"}}>
            {
                repoInfo.path.startsWith("_local_") ?
                    doI18n("pages:content:local_org", i18nRef.current) :
                    repoInfo.path.split("/").slice(0, 2).join(" ")
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
            <ContentRowButtonPlusMenu repoInfo={repoInfo}/>
        </Grid2>
    </>

}

export default ContentRow;