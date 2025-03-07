import {
  Box,
  Button,
  InputAdornment,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import ConfirmDialog from "../subcomponent/ConfirmDialog";
import { SettingsApiKey, SettingsYoutube } from "../settingsInterface";

interface YouTubeSettingsProps {
  settings: SettingsYoutube;
  apiKeySettings: SettingsApiKey;
  apiKeyExists: boolean;
  saveYoutubeApiKey: () => Promise<void>;
  getYoutubeApiKey: (callback: (key: string) => void) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelFontSize = "1.2em";
const inputFontSize = "1.1em";
const marginLeft = "10px";
const marginRight = "10px";

const fontSize = "16px";
const marginTop = "10px";
const marginBottom = "10px";

const YouTubeSettings: React.FC<YouTubeSettingsProps> = ({
  settings,
  apiKeySettings,
  apiKeyExists,
  saveYoutubeApiKey,
  getYoutubeApiKey,
  handleInputChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openApiKeyModal, setOpenApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const theme = useTheme();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: theme.palette.customColors.modalBg,
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDialog = () => {
    saveYoutubeApiKey();
    setOpenDialog(false);
  };

  const handleOpenApiKeyModal = () => {
    getYoutubeApiKey(handleApiKey);
    setOpenApiKeyModal(true);
  };

  const handleCloseApiKeyModal = () => {
    setApiKey("");
    setOpenApiKeyModal(false);
  };

  const handleApiKey = (key: string) => {
    setApiKey(key);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        YouTube
      </Typography>
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
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">
            {apiKeyExists ? "Api Key Present" : "Missing Api Key"}
          </Typography>

          <Tooltip title="Needed to connect to YouTube" arrow>
            <TextField
              name="apiKey"
              label="Api Key"
              autoComplete="off"
              value={apiKeySettings.apiKey}
              onChange={handleInputChange}
              margin="normal"
              sx={{
                width: "160px",
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              style={{
                fontSize: fontSize,
                marginTop: marginTop,
                marginBottom: marginBottom,
              }}
              sx={{
                marginLeft: marginLeft,
                marginRight: marginRight,
                width: "150px",
              }}
            >
              Save Api Key
            </Button>
            <ConfirmDialog
              open={openDialog}
              title="Save the api key?"
              content={`Save "${apiKeySettings.apiKey}" as the new api key?`}
              onClose={handleCloseDialog}
              onConfirm={handleConfirmDialog}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenApiKeyModal}
              style={{
                fontSize: fontSize,
                marginTop: marginTop,
                marginBottom: marginBottom,
              }}
              sx={{
                marginLeft: marginLeft,
                marginRight: marginRight,
                width: "150px",
              }}
            >
              Show Api Key
            </Button>
            <Modal
              open={openApiKeyModal}
              onClose={handleCloseApiKeyModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ color: theme.palette.customColors.myCustomText }}
                >
                  Your API Key is
                </Typography>
                <Typography
                  sx={{
                    mt: 2,
                    color: theme.palette.customColors.textColorLighter,
                  }}
                >
                  {apiKey == "" ? "No Api Key Found" : apiKey}
                </Typography>
              </Box>
            </Modal>
          </Box>

          {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        > */}
        </Box>

        <Tooltip
          title="Found at the end of the youtube stream url. From the url, include everything after the ?v="
          arrow
        >
          <TextField
            name="videoId"
            label="Video Id"
            value={settings.videoId}
            onChange={handleInputChange}
            margin="normal"
            sx={{
              width: "160px",
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

        <Tooltip title="Check README if you change this number" arrow>
          <TextField
            name="messageDelay"
            label="Message Delay"
            value={settings.messageDelay}
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
                  <InputAdornment position="end">sec</InputAdornment>
                ),
              },
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default YouTubeSettings;
