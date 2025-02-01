import { Box, Button, TextField, Typography } from "@mui/material";
import { SettingsAuthentication } from "./settingsInterface";

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

/*
If keys exist,
    Have text saying replace key
else
    Have text saying to enter a key

Maybe use typography for this and place it above the textfield
    then swap based on the flag

on save
    Only save textfields that are not empty
    Maybe add a "Are you sure" check
    wait for backend response maybe?
    clear the textfields and put a ""
    flip flag
        will cause typography text to change
*/

const AuthenticationSettings: React.FC<AuthenticationSettingsProps> = ({
  settings,
  handleInputChange,
  saveAuthentication,
}) => (
  <Box>
    <Typography>
      {settings.isYoutubeApiKeyPresent
        ? "Add Youtube Api Key"
        : "Update Youtube Api Key"}
    </Typography>
    <TextField
      name="youtubeApiKey"
      label="Youtube Api Key"
      value={settings.youtubeApiKey}
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
      {settings.isYoutubeApiKeyPresent ? "Add Twitch" : "Update Twitch"}
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
      onClick={saveAuthentication}
      style={{
        fontSize: fontSize,
        marginTop: marginTop,
        marginBottom: marginBottom,
      }}
      sx={{
        marginLeft: marginLeft,
        marginRight: marginRight,
        width: "100px",
      }}
    >
      Save Authentication
    </Button>
  </Box>
);

export default AuthenticationSettings;
