import React from "react";
import { Box, TextField, Tooltip, Typography } from "@mui/material";

interface PortSettingsProps {
  port: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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
        />
      </Tooltip>
    </Box>
  </Box>
);

export default PortSettings;
