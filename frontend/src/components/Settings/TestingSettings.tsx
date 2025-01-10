import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

interface TestingSettingsProps {
  settings: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TestingSettings: React.FC<TestingSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Testing
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <FormControlLabel
        control={
          <Tooltip
            title="Uncheck if you want to connect to youtube. Read README for more info."
            arrow
          >
            <Checkbox
              name="test"
              checked={settings.test}
              onChange={handleInputChange}
            />
          </Tooltip>
        }
        label="Test"
        sx={{ marginLeft: 2, marginRight: 2 }}
      />

      <Tooltip
        title="Only works if [test] is checked. Read README for more info."
        arrow
      >
        <TextField
          name="speedOfEmotes"
          label="Speed Of Emotes (seconds)"
          value={settings.speedOfEmotes}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default TestingSettings;
