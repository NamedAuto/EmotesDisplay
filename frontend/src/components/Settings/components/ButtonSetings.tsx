import { Box, Button, Tooltip } from "@mui/material";

interface ButonSettingsProps {
  isPreviewConnected: boolean;
  isYoutubeConnected: boolean;
  isTwitchConnected: boolean;
  handlePreviewStart: () => void;
  handlePreviewStop: () => void;
  handleYoutubeStart: () => void;
  handleYoutubeStop: () => void;
  handleTwitchStart: () => void;
  handleTwitchStop: () => void;
  handleReset: () => void;
  handleSave: () => void;
}

const fontSize = "16px";
const marginTop = "10px";
const marginBottom = "10px";
const marginLeft = "10px";
const marginRight = "10px";

const ButtonSettings: React.FC<ButonSettingsProps> = ({
  isPreviewConnected,
  isYoutubeConnected,
  isTwitchConnected,
  handlePreviewStart,
  handlePreviewStop,
  handleYoutubeStart,
  handleYoutubeStop,
  handleTwitchStart,
  handleTwitchStop,
  handleReset,
  handleSave,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Tooltip title="Save changes. Check README for more info" arrow>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{
            fontSize: fontSize,
            marginTop: marginTop,
            marginBottom: marginBottom,
          }}
          sx={{
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: "100px",
          }}
        >
          Save
        </Button>
      </Tooltip>

      <Tooltip title="Reset current changes back to the last save" arrow>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
          style={{
            fontSize: fontSize,
            marginTop: marginTop,
            marginBottom: marginBottom,
          }}
          sx={{
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: "100px",
          }}
        >
          Reset
        </Button>
      </Tooltip>
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Tooltip
        title={
          isTwitchConnected
            ? "Disconnect from Twitch"
            : "Display emotes from Twitch"
        }
        arrow
      >
        <Button
          variant="contained"
          color={isTwitchConnected ? "secondary" : "primary"}
          onClick={isTwitchConnected ? handleTwitchStop : handleTwitchStart}
          style={{
            fontSize: fontSize,
            marginTop: marginTop,
            marginBottom: marginBottom,
          }}
          sx={{
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: "160px",
          }}
        >
          {isTwitchConnected ? "Stop Twitch" : "Start Twitch"}
        </Button>
      </Tooltip>

      <Tooltip
        title={
          isPreviewConnected
            ? "Disconnect from YouTube"
            : "Display emotes from YouTube"
        }
        arrow
      >
        <Button
          variant="contained"
          color={isYoutubeConnected ? "secondary" : "primary"}
          onClick={isYoutubeConnected ? handleYoutubeStop : handleYoutubeStart}
          style={{
            fontSize: fontSize,
            marginTop: marginTop,
            marginBottom: marginBottom,
          }}
          sx={{
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: "160px",
          }}
        >
          {isYoutubeConnected ? "Stop YouTube" : "Start YouTube"}
        </Button>
      </Tooltip>

      <Tooltip
        title={
          isPreviewConnected ? "Stop random emotes" : "Display random emotes"
        }
        arrow
      >
        <Button
          variant="contained"
          color={isPreviewConnected ? "secondary" : "primary"}
          onClick={isPreviewConnected ? handlePreviewStop : handlePreviewStart}
          style={{
            fontSize: fontSize,
            marginTop: marginTop,
            marginBottom: marginBottom,
          }}
          sx={{
            marginLeft: marginLeft,
            marginRight: marginRight,
            width: "160px",
          }}
        >
          {isPreviewConnected ? "Stop Random" : "Start Random"}
        </Button>
      </Tooltip>
    </Box>
  </Box>
);

export default ButtonSettings;
