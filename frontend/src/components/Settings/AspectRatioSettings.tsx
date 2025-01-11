import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

interface AspectRatioSettingsProps {
  forceWidthHeight: boolean;
  width: string;
  height: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AspectRatioSettings: React.FC<AspectRatioSettingsProps> = ({
  forceWidthHeight,
  width,
  height,
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
      <Tooltip title="If checked, scales images larger than width x height down to fit inside" arrow>
        <FormControlLabel
          control={
            <Checkbox
              name="forceWidthHeight"
              checked={forceWidthHeight}
              onChange={handleInputChange}
            />
          }
          label="Force Width Height"
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>

      <TextField
        name="canvasWidth"
        label="Width"
        value={width}
        onChange={handleInputChange}
        type="number"
        margin="normal"
        sx={{ marginLeft: 2, marginRight: 2 }}
      />

      <TextField
        name="canvasHeight"
        label="Height"
        value={height}
        onChange={handleInputChange}
        type="number"
        margin="normal"
        sx={{ marginLeft: 2, marginRight: 2 }}
      />
    </Box>
  </Box>
);

export default AspectRatioSettings;
