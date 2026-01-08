import { DialogContent, DialogContentText, Typography } from "@mui/material";
import { PanDialog } from "pankosmia-rcl";

export default function AboutRepo({ repoInfo, open, closeFn }) {

    return <PanDialog
        titleLabel={`About ${repoInfo.abbreviation} - ${repoInfo.source} `}
        isOpen={open}
        closeFn={() => closeFn()}>
        <DialogContent>
            {repoInfo ? Object.entries(repoInfo).map(([key, value]) => {
                if (repoInfo.name === repoInfo.description) {
                    const keys = ["name", "flavor", "dateUpdated", "language_code"]
                    if (keys.includes(key)) {
                        return (
                            <DialogContentText key={key} mb={2}>
                                <Typography fullWidth size="small">
                                    {key} - {value}
                                </Typography>
                            </DialogContentText>
                        );
                    };
                } else {
                    const keys = ["name", "description", "flavor", "dateUpdated", "language_code"]
                    if (keys.includes(key)) {
                        return (
                            <DialogContentText key={key} mb={2}>
                                <Typography fullWidth size="small">
                                    {key} - {value}
                                </Typography>
                            </DialogContentText>
                        );
                    };
                }
                return null;
            }) : null}
        </DialogContent>
    </PanDialog>
}