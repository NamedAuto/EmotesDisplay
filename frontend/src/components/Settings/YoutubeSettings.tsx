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
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Tooltip
        title="Can get your own, but it can be confusing. Or use this one."
        arrow
      >
        <TextField
          type={showApiKey ? "text" : "password"}
          name="apiKey"
          label="Api Key"
          value={apiKey}
          onChange={handleInputChange}
          margin="normal"
          sx={{ width: "450px", marginLeft: 2, marginRight: 2 }}
          InputProps={{
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
          }}
        />
      </Tooltip>

      <Tooltip
        title="Found at the end of the youtube url. Include everything after the ?v= in the url."
        arrow
      >
        <TextField
          name="videoId"
          label="Youtube Video Id"
          value={videoId}
          onChange={handleInputChange}
          margin="normal"
          sx={{ marginLeft: 2, marginRight: 2 }}
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
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default YouTubeSettings;
