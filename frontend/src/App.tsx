import "./App.css";
import { ConfigProvider } from "./components/Config/Config";
import MyRoutes from "./components/Routes/Routes";
import { WebSocketProvider } from "./components/WebSocket/WebSocketProvider";

function App() {
  return (
    <div id="App">
      <ConfigProvider>
        <WebSocketProvider>
          <MyRoutes />
        </WebSocketProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
