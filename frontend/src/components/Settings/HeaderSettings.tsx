import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface HeaderSettingsProps {
  port: string;
}

const getVersionInfo = async (port: string) => {
  try {
    const url = `http://localhost:${port}/version`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const versionInfo = response.json();
    return versionInfo;
  } catch (error) {
    console.error("Error fetching app version:", error);
  }

  return null;
};

const HeaderSettings: React.FC<HeaderSettingsProps> = ({ port }) => {
  const [versionInfo, setVersionInfo] = useState<{
    owner: string;
    repoName: string;
    currentVersion: string;
    latestVersion: string;
  } | null>(null);

  useEffect(() => {
    const fetchVersionInfo = async () => {
      const data = await getVersionInfo(port);
      setVersionInfo(data);
    };
    fetchVersionInfo();
  }, [port]);

  return (
    <Box
      sx={{
        pt: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Tooltip
        title={
          versionInfo
            ? versionInfo.currentVersion === versionInfo.latestVersion
              ? "Current version"
              : "Download the latest version here"
            : "erm..."
        }
        arrow
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{ marginRight: "20px", marginLeft: "40px" }}
        >
          {versionInfo ? (
            versionInfo.currentVersion === versionInfo.latestVersion? (
              `${versionInfo.currentVersion}`
            ) : (
              // <Tooltip title="Download the latest version here" arrow>
              <Link
                href={`https://github.com/${versionInfo.owner}/${versionInfo.repoName}/releases/latest`}
                target="_blank"
                rel="noopener"
              >
                New version
              </Link>
              // </Tooltip>
            )
          ) : (
            "erm..."
          )}
        </Typography>
      </Tooltip>

      <Tooltip
        title="This is the url to open in a browser or web view/item"
        arrow
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginLeft: "10px", marginRight: "10px" }}
        >
          {`http://localhost:${port}/show`}
        </Typography>
      </Tooltip>

      <Tooltip title="Open a window with the url" arrow>
        <Typography
          variant="h5"
          gutterBottom
          style={{ marginLeft: "10px", marginRight: "40px" }}
        >
          <Link
            href={`http://localhost:${port}/show`}
            target="_blank"
            rel="noopener"
          >
            or click and zoom out
          </Link>
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default HeaderSettings;
