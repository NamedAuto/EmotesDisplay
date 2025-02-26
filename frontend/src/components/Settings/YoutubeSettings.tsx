import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { SettingsApiKey, SettingsYoutube } from "./settingsInterface";
import ConfirmDialog from "./ConfirmDialog";

interface YouTubeSettingsProps {
  settings: SettingsYoutube;
  apiKeySettings: SettingsApiKey;
  apiKeyExists: boolean;
  saveYoutubeApiKey: () => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const fontSize = "16px";
const marginTop = "10px";
const marginBottom = "10px";

/*

GOAL
1) Input field for api key
2) Save button for api key
3) On Success, the key is cleared and a flag is raised
4) MAYBE add Typography saying key is now present
5) Have button that will show the key from the back end

*/

const YouTubeSettings: React.FC<YouTubeSettingsProps> = ({
  settings,
  apiKeySettings,
  apiKeyExists,
  saveYoutubeApiKey,
  handleInputChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDialog = () => {
    saveYoutubeApiKey();
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Youtube
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography>
          {apiKeyExists ? "Update Api Key" : "No Api Key found. Add one"}
        </Typography>
        <TextField
          name="apiKey"
          label="Api Key"
          value={apiKeySettings.apiKey}
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

        {/* <Tooltip title="Needed to connect to youtube" arrow>
        <TextField
          type={showApiKey ? "text" : "password"}
          name="apiKey"
          label="Api Key"
          value={settings.apiKey}
          onChange={handleInputChange}
          margin="normal"
          sx={{
            width: "300px",
            marginLeft: marginLeft,
            marginRight: marginRight,
            "& .MuiInputLabel-root": {
              fontSize: labelFontSize,
            },
            "& .MuiInputBase-input": {
              fontSize: inputFontSize,
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Tooltip> */}

        {/* <TextField
        name="hasApiKey"
        label="API Key Present"
        value={settings.videoId}
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
      /> */}

        <Tooltip
          title="Found at the end of the youtube stream url. From the url, include everything after the ?v="
          arrow
        >
          <TextField
            name="videoId"
            label="Video Id"
            value={settings.videoId}
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
        </Tooltip>

        <Tooltip title="Check README if you change this number." arrow>
          <TextField
            name="messageDelay"
            label="Message Delay"
            value={settings.messageDelay}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{
              width: "150px",
              marginLeft: marginLeft,
              marginRight: marginRight,
              "& .MuiInputLabel-root": {
                fontSize: labelFontSize,
              },
              "& .MuiInputBase-input": {
                fontSize: inputFontSize,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">sec</InputAdornment>
                ),
              },
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default YouTubeSettings;
