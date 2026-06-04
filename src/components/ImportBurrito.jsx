import { useContext, useState, useEffect } from "react";
import { Button, DialogContent, Tooltip, useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { doI18n } from "pithekos-lib";
import { i18nContext } from "pankosmia-rcl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import { useFilePicker } from "use-file-picker";

function ImportBurrito({ open, closeFn, reposModCount, setReposModCount }) {
  const { i18nRef } = useContext(i18nContext);
  const [loading, setLoading] = useState(false);
  const [filePicked, setFilePicked] = useState(null);
  const theme = useTheme();

  const { openFilePicker, plainFiles } = useFilePicker({
    accept: [".zip"],
    readFilesContent: false,
  });
  const isZip = filePicked?.name?.toLowerCase().endsWith(".zip");
  useEffect(() => {
    console.log(plainFiles);
    if (plainFiles.length > 0) {
      const file = plainFiles[0];

      setFilePicked(file);
    }
  }, [plainFiles]);
  console.log(plainFiles);

  const handleImport = async (file) => {
    const formData = new FormData();

    formData.append("file", file, file.name);
    const fileName = file?.name?.replace(/\.[^/.]+$/, "");
    const response = await fetch(
      `/api/burrito/zipped/_local_/_sideloaded_/${encodeURIComponent(fileName)}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (response.ok) {
      setFilePicked(null);
      enqueueSnackbar(
        doI18n("pages:content:burrito_imported", i18nRef.current),
        { variant: "success" },
      );
      setReposModCount(reposModCount + 1);
    } else {
      const error = await response.json();
      enqueueSnackbar(
        `${doI18n("pages:content:could_not_import_burrito", i18nRef.current)}: ${error.reason}`,
        { variant: "error" },
      );
    }
  };

  return (
    <PanDialog
      titleLabel={doI18n("pages:content:import_content", i18nRef.current)}
      isOpen={open}
      closeFn={() => {
        setFilePicked(null);
        closeFn();
      }}
      theme={theme}
    >
      <DialogContent sx={{ mt: 1 }}>
        <Button
          onClick={() => {
            openFilePicker();
          }}
          type="button"
          disabled={loading}
          variant="contained"
          color="primary"
          component="span"
          startIcon={<UploadFileIcon />}
        >
          {loading
            ? "Reading File..."
            : filePicked?.name
              ? filePicked?.name
              : doI18n("pages:content:import_burrito_click", i18nRef.current)}
        </Button>
      </DialogContent>
      <Tooltip
        open={!isZip && filePicked}
        title={doI18n("pages:content:file_invalid", i18nRef.current)}
        placement="top-end"
      >
        <span>
          <PanDialogActions
            actionFn={() => {
              handleImport(filePicked);
              closeFn();
              setTimeout(() => setFilePicked(null), 1500);
            }}
            isDisabled={!filePicked || !isZip}
            actionLabel={doI18n("pages:content:create", i18nRef.current)}
            closeFn={() => {
              closeFn();
              setFilePicked(null);
            }}
            closeLabel={doI18n("pages:content:cancel", i18nRef.current)}
          />
        </span>
      </Tooltip>
    </PanDialog>
  );
}

export default ImportBurrito;
