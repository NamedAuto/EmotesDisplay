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
        // display: "flex",
        alignItems: "left",
        // justifyContent: "center",
        flexDirection: "column",
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
        InputLabelProps={{
          style: { fontSize: "1.2em" },
        }}
        sx={{
          marginLeft: 2,
          marginRight: 2,
          "& .MuiInputBase-input": {
            fontSize: "1.5em",
          },
          width: "150px",
        }}
      />

      <TextField
        name="canvasHeight"
        label="Height"
        value={height}
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
          width: "150px",
        }}
      />
    </Box>
  </Box>
);

export default AspectRatioSettings;
