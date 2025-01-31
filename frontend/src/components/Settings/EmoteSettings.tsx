import {
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { SettingsEmote } from "./settingsInterface";

interface EmoteSettingsProps {
  settings: SettingsEmote;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const EmoteSettings: React.FC<EmoteSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Emote
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
        title="If checked, emotes from the same message will be displayed together"
        arrow
      >
        <FormControlLabel
          control={
            <Checkbox
              name="groupEmotes"
              checked={settings.groupEmotes}
              onChange={handleInputChange}
            />
          }
          label="Group Emotes"
          sx={{ marginLeft: marginLeft, marginRight: marginRight }}
        />
      </Tooltip>

      <Tooltip title="Choose the size to display emotes in px(pixels)" arrow>
        <TextField
          name="emoteWidth"
          label="Width and Height"
          value={settings.emoteWidth}
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
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    color: "yellow", // Change text color
                  }}
                >
                  px
                </InputAdornment>
              ),
            },
          }}
        />
      </Tooltip>

      <Tooltip
        title="Increase the size of the emote randomly by up to the number provided"
        arrow
      >
        <TextField
          name="randomSizeIncrease"
          label="Random Size Increase"
          value={settings.randomSizeIncrease}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{
            width: "200px",
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
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            },
          }}
        />
      </Tooltip>

      <Tooltip
        title="Decrease the size of the emote randomly by up to the number provided"
        arrow
      >
        <TextField
          name="randomSizeDecrease"
          label="Random Size Decrease"
          value={settings.randomSizeDecrease}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{
            width: "200px",
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
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            },
          }}
        />
      </Tooltip>

      <Tooltip
        title="Max group of emotes to show before replacing the oldest ones"
        arrow
      >
        <TextField
          name="maxEmoteCount"
          label="Max Emote Groups"
          value={settings.maxEmoteCount}
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

      <Tooltip
        title="Make emotes round. 0 does nothing. 50+ makes it a circle"
        arrow
      >
        <TextField
          name="emoteRoundness"
          label="Roundness (0 - 50)"
          value={settings.emoteRoundness}
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

      <Tooltip
        title="Color the transparent portion of an emote. Only change the numbers"
        arrow
      >
        <TextField
          name="emoteBackgroundColor"
          label="Background Color"
          value={settings.emoteBackgroundColor}
          onChange={handleInputChange}
          margin="normal"
          sx={{
            width: "250px",
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

export default EmoteSettings;
