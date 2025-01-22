import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface YouTubeSettingsProps {
  apiKey: string;
  videoId: string;
  messageDelay: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showApiKey: boolean;
  handleClickShowPassword: () => void;
}

const YouTubeSettings: React.FC<YouTubeSettingsProps> = ({
  apiKey,
  videoId,
  messageDelay,
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
        alignItems: "left",
        // justifyContent: "center",
        flexDirection: "column",
        flexWrap: "wrap",
      }}
    >
      <Tooltip title="Needed to connect to youtube" arrow>
        <TextField
          type={showApiKey ? "text" : "password"}
          name="apiKey"
          label="Api Key"
          value={apiKey}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{
            style: { fontSize: "1.2em" }, // Adjust the font size as needed
          }}
          sx={{
            width: "400px",
            marginLeft: 2,
            marginRight: 2,
          }}
          slotProps={{
            input: {
              style: { fontSize: "1.5em" },
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
          label="Youtube Video Id"
          value={videoId}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{
            style: { fontSize: "1.2em" },
          }}
          sx={{
            marginLeft: 2,
            marginRight: 2,
            "& .MuiInputBase-input": {
              fontSize: "1.5em",
            },
            width: "250px",
          }}
        />
      </Tooltip>

      <Tooltip title="Check README if you change this number." arrow>
        <TextField
          name="messageDelay"
          label="Message Delay (seconds)"
          value={messageDelay}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          InputLabelProps={{
            style: { fontSize: "1.2em" },
          }}
          sx={{
            marginLeft: 2,
            marginRight: 2,
            "& .MuiInputBase-input": {
              fontSize: "1.5em",
            },
            width: "200px",
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default YouTubeSettings;
