import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useConfig } from "../Config/Config";

const SettingsPage: React.FC = () => {
  const config = useConfig();

  // Youtube
  const [apiKey, setApiKey] = useState<string>(config.Youtube.ApiKey);
  const [videoId, setVideoId] = useState<string>(config.Youtube.VideoId);
  const [messageDelay, setMessageDelay] = useState<string>(
    config.Youtube.MessageDelay.toString()
  );

  // Port
  const [port, setPort] = useState<string>(config.Port.toString());

  // Aspect Ratio
  const [forceWidthHeight, setForcedWidthHeight] = useState<boolean>(
    config.AspectRatio.ForceWidthHeight
  );
  const [canvasWidth, setCanvasWidth] = useState<string>(
    config.AspectRatio.Width.toString()
  );
  const [canvasHeight, setCanvasHeight] = useState<string>(
    config.AspectRatio.Height.toString()
  );

  const [scaleCanvas, setScaleCanvase] = useState<string>(
    config.AspectRatio.ScaleCanvas.toString()
  );
  const [scaleImage, setScaleImage] = useState<string>(
    config.AspectRatio.ScaleImage.toString()
  );

  // Emote
  const [emoteHeight, setEmoteHeight] = useState<string>(
    config.Emote.Height.toString()
  );
  const [emoteWidth, setEmoteWidth] = useState<string>(
    config.Emote.Width.toString()
  );
  const [randomSizeIncrease, setRandomSizeIncrease] = useState<string>(
    config.Emote.RandomSizeIncrease.toString()
  );
  const [randomSizeDecrease, setRandomSizeDecrease] = useState<string>(
    config.Emote.RandomSizeDecrease.toString()
  );
  const [maxEmoteCount, setMaxEmoteCount] = useState<string>(
    config.Emote.MaxEmoteCount.toString()
  );
  const [roundness, setRoundness] = useState<string>(
    config.Emote.Roundness.toString()
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    config.Emote.BackgroundColor
  );

  // Testing
  const [test, setTest] = useState<boolean>(config.Testing.Test);
  const [speedOfEmotes, setSpeedOfEmotes] = useState<string>(
    config.Testing.SpeedOfEmotes.toString()
  );

  const handleSave = () => {
    console.log("Settings saved");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid2>
        <Typography variant="h4" gutterBottom>
          Youtube
        </Typography>
        <TextField
          label="Api Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Video Id"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Message Delay"
          value={messageDelay}
          onChange={(e) => setMessageDelay(e.target.value)}
          type="number"
          margin="normal"
        />
      </Grid2>

      <Grid2>
        <Typography variant="h4" gutterBottom>
          Port
        </Typography>
        <TextField
          label="Api Key"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          type="number"
          margin="normal"
        />
      </Grid2>

      <Grid2>
        <Typography variant="h4" gutterBottom>
          Aspect Ratio
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={forceWidthHeight}
              onChange={(e) => setForcedWidthHeight(e.target.checked)}
            />
          }
          label="Force Width Height"
        />
        <TextField
          label="Width"
          value={canvasWidth}
          onChange={(e) => setCanvasWidth(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Height"
          value={canvasHeight}
          onChange={(e) => setCanvasHeight(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Scale Canvas"
          value={scaleCanvas}
          onChange={(e) => setScaleCanvase(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Scale Image"
          value={scaleImage}
          onChange={(e) => setScaleImage(e.target.value)}
          type="number"
          margin="normal"
        />
      </Grid2>

      <Grid2>
        <Typography variant="h4" gutterBottom>
          Emote
        </Typography>
        <TextField
          label="Emote Width"
          value={emoteWidth}
          onChange={(e) => setEmoteWidth(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Emote Height"
          value={emoteHeight}
          onChange={(e) => setEmoteHeight(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Random Size Increase"
          value={randomSizeIncrease}
          onChange={(e) => setRandomSizeIncrease(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Random Size Decrease"
          value={randomSizeDecrease}
          onChange={(e) => setRandomSizeDecrease(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Max Emote Count"
          value={maxEmoteCount}
          onChange={(e) => setMaxEmoteCount(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Roundness"
          value={roundness}
          onChange={(e) => setRoundness(e.target.value)}
          type="number"
          margin="normal"
        />
        <TextField
          label="Background Color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          margin="normal"
        />
      </Grid2>

      <Grid2>
        <Typography variant="h4" gutterBottom>
          Testing
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={test}
              onChange={(e) => setTest(e.target.checked)}
            />
          }
          label="Test"
        />
        <TextField
          label="Speed Of Emotes"
          value={speedOfEmotes}
          onChange={(e) => setSpeedOfEmotes(e.target.value)}
          type="number"
          margin="normal"
        />
      </Grid2>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: "20px" }}
      >
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
