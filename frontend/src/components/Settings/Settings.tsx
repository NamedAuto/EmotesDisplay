// import { Button, Grid2, Typography } from "@mui/material";

// function Settings() {
//   return (
//     <Grid2>
//       <Typography variant="h1">Test Component 1</Typography>
//       <Button size="large" variant="contained">
//         THIS
//       </Button>
//     </Grid2>
//   );
// }

// export default Settings;


import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Checkbox,
  Slider,
  Button
} from '@mui/material';

const SettingsPage: React.FC = () => {
  // State variables for settings
  const [username, setUsername] = useState<string>('');
  const [theme, setTheme] = useState<string>('light');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [newsletter, setNewsletter] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);

  const handleSave = () => {
    // Handle save settings
    console.log('Settings saved');  
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Theme</InputLabel>
        <Select
          value={theme}
          onChange={(e) => setTheme(e.target.value as string)}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
        label="Enable Notifications"
      />

      <FormControlLabel
        control={<Checkbox checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />}
        label="Subscribe to Newsletter"
      />

      <Typography gutterBottom>Volume</Typography>
      <Slider
        value={volume}
        onChange={(e, newValue) => setVolume(newValue as number)}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
        max={100}
      />

      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPage;




/*

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

*/