import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { SettingsAuthentication } from "../settingsInterface";
import { useState } from "react";
import ConfirmDialog from "../subcomponent/ConfirmDialog";

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const fontSize = "16px";
const marginTop = "10px";
const marginBottom = "10px";

interface AuthenticationSettingsProps {
  settings: SettingsAuthentication;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  saveAuthentication: () => void;
}

const AuthenticationSettings: React.FC<AuthenticationSettingsProps> = ({
  settings,
  handleInputChange,
  saveAuthentication,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDialog = () => {
    saveAuthentication();
    setOpen(false);
  };

  return (
    <Box>
      <Typography>
        {settings.isYoutubeApiKeyPresent
          ? "Update Youtube Api Key"
          : "No Youtube Api Key found. Add one"}
      </Typography>
      <TextField
        name="youtubeApiKey"
        label="Youtube Api Key"
        value={settings.youtubeApiKeyssss}
        onChange={handleInputChange}
        margin="normal"
        sx={{
          width: "160px",
          marginLeft: marginLeft,
          marginRight: marginRight,
          "& .MuiInputLabel-root": {
            fontSize: labelFontSize,
          },
          "& .MuiInputBase-input": {
            fontSize: inputFontSize,
          },
        }}
      />
      <Typography>
        {settings.isTwitchPresent
          ? "Update Twitch"
          : "No Twitch found. Add one"}
      </Typography>
      <TextField
        name="twitch"
        label="twitch"
        value={settings.twitch}
        onChange={handleInputChange}
        margin="normal"
        sx={{
          width: "160px",
          marginLeft: marginLeft,
          marginRight: marginRight,
          "& .MuiInputLabel-root": {
            fontSize: labelFontSize,
          },
          "& .MuiInputBase-input": {
            fontSize: inputFontSize,
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        style={{
          fontSize: fontSize,
          marginTop: marginTop,
          marginBottom: marginBottom,
        }}
        sx={{
          marginLeft: marginLeft,
          marginRight: marginRight,
          width: "150px",
        }}
      >
        Save Authentication
      </Button>
      <ConfirmDialog
        open={open}
        title="Save non-empty values?"
        content="This will save/overwrite non-empty inputs"
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
      />
    </Box>
  );
};

export default AuthenticationSettings;
