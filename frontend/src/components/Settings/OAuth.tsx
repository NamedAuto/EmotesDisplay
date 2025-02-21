import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const hash = location.hash;
  const code = new URLSearchParams(location.search).get("code");
  // const code = new URLSearchParams(hash.substring(1)).get("access_token");

  const { isConnected, updateHandlers, sendMessage } = useWebSocketContext();
  const codeSentRef = useRef(false);

  useEffect(() => {
    const code = () => {};

    updateHandlers({
      "twitch-code": code,
    });
  }, [updateHandlers]);

  useEffect(() => {
    console.log("OAC: ", code);
    if (code && isConnected && !codeSentRef.current) {
      console.log("OAuth code:", code);

      sendCodeToBackend(code).then(() => {
        // Navigate away from the callback page
        // Or show a "Authorization Success"
        // navigate("/")
      });

      codeSentRef.current = true;
    }
  }, [code, navigate, isConnected]);

  const sendCodeToBackend = async (code: string) => {
    console.log("SENDING");
    const eventData = {
      eventType: "twitch-user-auth-code",
      code: code,
    };
    sendMessage(eventData);
  };

  return <div>Processing...</div>;
};

export default OAuthCallback;
