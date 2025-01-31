import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { SettingsYoutube } from "./settingsInterface";

interface YouTubeSettingsProps {
  settings: SettingsYoutube;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showApiKey: boolean;
  handleClickShowPassword: () => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const YouTubeSettings: React.FC<YouTubeSettingsProps> = ({
  settings,
  handleInputChange,
  showApiKey,
  handleClickShowPassword,
}) => (
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
      <Tooltip title="Needed to connect to youtube" arrow>
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
      </Tooltip>

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
              endAdornment: <InputAdornment position="end">sec</InputAdornment>,
            },
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default YouTubeSettings;
