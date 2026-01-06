import { DialogContent, ListItem } from "@mui/material";
import { PanDialog } from "pankosmia-rcl";

export default function AboutRepo({ repoInfo, open, closeFn }) {

    return <PanDialog
        titleLabel="About repo"
        isOpen={open}
        closeFn={() => closeFn()}>
        <DialogContent>
            {repoInfo ? Object.entries(repoInfo).map(([key, value]) => {
                return `${key}: ${value}`;
            }) : null}
        </DialogContent>
    </PanDialog>
}