import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { SettingsPreview } from "../settingsInterface";

interface PreviewSettingsProps {
  settings: SettingsPreview;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const PreviewSettings: React.FC<PreviewSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Random
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <FormGroup>
        <Tooltip title="Use images from the ChannelEmotesYT folder" arrow>
          <FormControlLabel
            control={
              <Checkbox
                name="useChannelEmotes"
                checked={settings.useChannelEmotes}
                onChange={handleInputChange}
              />
            }
            label="Use Channel Emotes"
            // labelPlacement="bottom"
            sx={{ marginLeft: marginLeft, marginRight: marginRight }}
          />
        </Tooltip>

        <Tooltip title="Use images from the GlobalEmotesYT folder" arrow>
          <FormControlLabel
            control={
              <Checkbox
                name="useGlobalEmotes"
                checked={settings.useGlobalEmotes}
                onChange={handleInputChange}
              />
            }
            label="Use Global Emotes"
            // labelPlacement="bottom"
            sx={{ marginLeft: marginLeft, marginRight: marginRight }}
          />
        </Tooltip>

        <Tooltip title="Use images from the RandomEmotes folder" arrow>
          <FormControlLabel
            control={
              <Checkbox
                name="useRandomEmotes"
                checked={settings.useRandomEmotes}
                onChange={handleInputChange}
              />
            }
            label="Use Random Emotes"
            // labelPlacement="bottom"
            sx={{ marginLeft: marginLeft, marginRight: marginRight }}
          />
        </Tooltip>
      </FormGroup>

      <Tooltip
        title="Number of emotes that are in a group. Limited by Max Per Msg in Emotes section."
        arrow
      >
        <TextField
          name="maxRandomEmotes"
          label="Max Random"
          value={settings.maxRandomEmotes}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{
            width: "125px",
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

      <Tooltip
        title="Delay before more emotes are displayed. Lower is faster"
        arrow
      >
        <TextField
          name="speedOfEmotes"
          label="Delay"
          value={settings.speedOfEmotes}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{
            width: "125px",
            marginLeft: marginLeft,
            marginRight: marginRight,
            "& .MuiInputLabel-root": {
              fontSize: labelFontSize,
            },
            "& .MuiInputBase-input": {
              fontSize: inputFontSize,
            },
          }}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">sec</InputAdornment>,
            },
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default PreviewSettings;
