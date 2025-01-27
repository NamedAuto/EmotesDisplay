import { Box, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";

interface PortSettingsProps {
  port: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const PortSettings: React.FC<PortSettingsProps> = ({
  port,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Port
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
        title="Port number the app will use. Check README if changing"
        arrow
      >
        <TextField
          name="port"
          label="Port"
          value={port}
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
      </Tooltip>
    </Box>
  </Box>
);

export default PortSettings;
