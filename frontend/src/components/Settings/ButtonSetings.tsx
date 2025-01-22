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
          fontSize: "18px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
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
          fontSize: "18px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
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
          fontSize: "18px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        sx={{ marginLeft: 2, marginRight: 2, width: "200px" }}
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
          fontSize: "18px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        sx={{ marginLeft: 2, marginRight: 2, width: "200px" }}
      >
        {isYoutubeConnected ? "Stop Youtube" : "Start Youtube"}
      </Button>
    </Tooltip>
  </Box>
);

export default ButtonSettings;
