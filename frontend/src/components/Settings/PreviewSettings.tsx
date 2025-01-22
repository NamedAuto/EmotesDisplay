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
        alignItems: "left",
        // justifyContent: "center",
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

export default PreviewSettings;
