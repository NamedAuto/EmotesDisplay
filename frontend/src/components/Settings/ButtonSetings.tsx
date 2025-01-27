import { Box, Button, Tooltip } from "@mui/material";

interface ButonSettingsProps {
  isPreviewConnected: boolean;
  isYoutubeConnected: boolean;
  handlePreviewStart: () => void;
  handlePreviewStop: () => void;
  handleYoutubeStart: () => void;
  handleYoutubeStop: () => void;
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
  handlePreviewStart,
  handlePreviewStop,
  handleYoutubeStart,
  handleYoutubeStop,
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
    <Tooltip
      title="Save changes. Has some quirks involving saving. Read README"
      arrow
    >
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

    <Tooltip title="Reset settings back to the last save" arrow>
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

    <Tooltip
      title={
        isPreviewConnected
          ? "Stop displaying random emotes on the screen"
          : "Display random emotes on the screen"
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
        {isPreviewConnected ? "Stop Preview" : "Start Preview"}
      </Button>
    </Tooltip>

    <Tooltip
      title={
        isPreviewConnected
          ? "Disconnect from youtube"
          : "Connect to youtube and display emotes from chat"
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
        {isYoutubeConnected ? "Stop Youtube" : "Start Youtube"}
      </Button>
    </Tooltip>
  </Box>
);

export default ButtonSettings;
