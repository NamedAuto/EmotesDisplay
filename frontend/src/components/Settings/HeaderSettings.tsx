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
    <Box>
      <Box
        sx={{
          pt: 1,
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
              : "Couldn't connect"
          }
          arrow
        >
          <Typography
            // fontSize={"1.5rem"}
            // variant="h5"
            gutterBottom
            style={{ marginRight: "10px", marginLeft: "10px" }}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.4rem",
                md: "1.5rem",
                lg: "1.5rem",
              },
            }}
          >
            {versionInfo ? (
              versionInfo.currentVersion === versionInfo.latestVersion ? (
                `${versionInfo.currentVersion}`
              ) : (
                <Link
                  href={`https://github.com/${versionInfo.owner}/${versionInfo.repoName}/releases/latest`}
                  target="_blank"
                  rel="noopener"
                >
                  New version
                </Link>
              )
            ) : (
              "erm..."
            )}
          </Typography>
        </Tooltip>

        <Tooltip title="This is the url you will be using" arrow>
          <Typography
            // fontSize={"2rem"}
            // variant="h4"
            gutterBottom
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.3rem",
                md: "2rem",
                lg: "2rem",
              },
            }}
          >
            {`http://localhost:${port}/show`}
          </Typography>
        </Tooltip>

        <Tooltip title="Open the url in a window to see it quickly" arrow>
          <Typography
            fontSize={"1.5rem"}
            // variant="h5"
            gutterBottom
            style={{ marginLeft: "10px", marginRight: "10px" }}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.4rem",
                md: "1.5rem",
                lg: "1.5rem",
              },
            }}
          >
            <Link
              href={`http://localhost:${port}/show`}
              target="_blank"
              rel="noopener"
            >
              or click here
            </Link>
          </Typography>
        </Tooltip>
      </Box>
      <Box
        sx={{
          pt: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* <Tooltip title="This is the url you will be using" arrow>
          <Typography
            // fontSize={"2rem"}
            // variant="h4"
            gutterBottom
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2rem",
                lg: "2rem",
              },
            }}
          >
            {`http://localhost:${port}/show`}
          </Typography>
        </Tooltip> */}
      </Box>
    </Box>
  );
};

export default HeaderSettings;
