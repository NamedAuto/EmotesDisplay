import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Tooltip,
  InputAdornment,
  Grid2,
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
    <Grid2
      container
      spacing={2}
      sx={{
        display: "flex",
        alignItems: "left",
        // justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
        <Tooltip title="Choose the size to display emotes in px(pixels)" arrow>
          <TextField
            name="emoteWidth"
            label="Width and Height (px)"
            value={settings.emoteWidth}
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
        <Tooltip
          title="Decrease the size of the emote randomly by up to the number provided"
          arrow
        >
          <TextField
            name="randomSizeDecrease"
            // label="Random Size Decrease (px)"
            value={settings.randomSizeDecrease}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            slotProps={{
              input: {
                color: "secondary",
                style: { fontSize: "1.5em" },
                endAdornment: (
                  <InputAdornment position="end">px</InputAdornment>
                ),
              },
            }}
            InputLabelProps={{
              style: { fontSize: "1.2em" },
            }}
            sx={{
              marginLeft: 2,
              marginRight: 2,
              width: "200px",
            }}
          />
        </Tooltip>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
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
            // size="small"
            InputLabelProps={{
              style: { fontSize: "1.2em" },
            }}
            sx={{
              marginLeft: 2,
              marginRight: 2,
              "& .MuiInputBase-input": {
                fontSize: "1.2em",
              },
              width: "250px",
            }}
          />
        </Tooltip>
      </Grid2>
    </Grid2>
  </Box>
);

export default EmoteSettings;
