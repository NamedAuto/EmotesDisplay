import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

interface HeaderSettingsProps {
  port: string;
}

const HeaderSettings: React.FC<HeaderSettingsProps> = ({ port }) => (
  <Box
    sx={{
      pt: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    <Typography variant="h5" gutterBottom style={{ marginRight: "20px" }}>
      Copy this link →
    </Typography>
    <Typography
      variant="h5"
      gutterBottom
      style={{ marginLeft: "20px", marginRight: "20px" }}
    >
      {`http://localhost:${port}/show`}
    </Typography>
    <Typography variant="h5" gutterBottom style={{ marginLeft: "20px" }}>
      <Link
        href={`http://localhost:${port}/show`}
        target="_blank"
        rel="noopener"
      >
        or click and zoom out
      </Link>
    </Typography>
  </Box>
);

export default HeaderSettings;
