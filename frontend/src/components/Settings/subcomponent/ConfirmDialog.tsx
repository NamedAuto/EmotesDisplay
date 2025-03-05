import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useTheme,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      //   aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          backgroundColor: theme.palette.customColors.backgroundDarker,
          color: theme.palette.customColors.myCustomText,
          fontSize: "1.3em",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          fontSize: "1.2em",
        }}
      >
        {content}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
        <Button
          onClick={onClose}
          color="secondary"
          sx={{
            fontSize: "1.1em",
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          sx={{
            fontSize: "1.1em",
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
