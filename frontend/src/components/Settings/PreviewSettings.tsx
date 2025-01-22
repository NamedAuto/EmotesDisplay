import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

interface PreviewSettingsProps {
  settings: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Preview
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Tooltip title="Only works for preview. Lower is faster" arrow>
        <TextField
          name="speedOfEmotes"
          label="Emotes Delay (seconds)"
          value={settings.speedOfEmotes}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{
            width: "200px",
            marginLeft: 2,
            marginRight: 2,
            "& .MuiInputLabel-root": {
              fontSize: "1.2em", // Adjust the font size as needed
            },
            "& .MuiInputBase-input": {
              fontSize: "1.2em", // Adjust the font size as needed
            },
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default PreviewSettings;
