import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { SettingsAspectRatio } from "./settingsInterface";

interface AspectRatioSettingsProps {
  settings: SettingsAspectRatio;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const AspectRatioSettings: React.FC<AspectRatioSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Aspect Ratio
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
        title="If checked, scales images larger than width x height down to fit inside it"
        arrow
      >
        <FormControlLabel
          control={
            <Checkbox
              name="forceWidthHeight"
              checked={settings.forceWidthHeight}
              onChange={handleInputChange}
            />
          }
          label="Force Width x Height"
          sx={{ marginLeft: marginLeft, marginRight: marginRight }}
        />
      </Tooltip>

      <TextField
        name="canvasWidth"
        label="Width"
        value={settings.canvasWidth}
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
      />

      <TextField
        name="canvasHeight"
        label="Height"
        value={settings.canvasHeight}
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
      />
    </Box>
  </Box>
);

export default AspectRatioSettings;
