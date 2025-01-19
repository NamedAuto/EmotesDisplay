import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

interface EmoteSettingsProps {
  settings: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>

      <Tooltip title="Choose the size to display emotes in px(pixels)" arrow>
        <TextField
          name="emoteWidth"
          label="Width and Height (px)"
          value={settings.emoteWidth}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>

      <Tooltip
        title="Increase the size of the emote randomly by up to the number provided"
        arrow
      >
        <TextField
          name="randomSizeIncrease"
          label="Random Size Increase (px)"
          value={settings.randomSizeIncrease}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>

      <Tooltip
        title="Decrease the size of the emote randomly by up to the number provided"
        arrow
      >
        <TextField
          name="randomSizeDecrease"
          label="Random Size Decrease (px)"
          value={settings.randomSizeDecrease}
          onChange={handleInputChange}
          type="number"
          margin="normal"
          sx={{ marginLeft: 2, marginRight: 2 }}
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
          sx={{ marginLeft: 2, marginRight: 2 }}
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
          sx={{ marginLeft: 2, marginRight: 2 }}
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
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export default EmoteSettings;
