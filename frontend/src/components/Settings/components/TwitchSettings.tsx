import { Box, TextField, Tooltip, Typography } from "@mui/material";
import { SettingsTwitch } from "../settingsInterface";

interface TwitchSettingsProps {
  settings: SettingsTwitch;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const TwitchSettings: React.FC<TwitchSettingsProps> = ({
  settings,
  handleInputChange,
}) => (
  <Box>
    <Typography variant="h4" sx={{ textAlign: "center" }}>
      Twitch
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Tooltip title="Twitch channel to connect to" arrow>
        <TextField
          name="channelName"
          label="Channel Name"
          value={settings.channelName}
          onChange={handleInputChange}
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
        />
      </Tooltip>
    </Box>
  </Box>
);

export default TwitchSettings;
