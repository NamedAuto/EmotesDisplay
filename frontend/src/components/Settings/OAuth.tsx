import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const code = new URLSearchParams(location.search).get("code");

  const { isConnected, updateHandlers, sendMessage } = useWebSocketContext();
  const codeSentRef = useRef(false);

  useEffect(() => {
    const code = () => {};

    updateHandlers({
      "twitch-code": code,
    });
  }, [updateHandlers]);

  useEffect(() => {
    console.log("OAC");
    if (code && isConnected && !codeSentRef.current) {
      // Handle the OAuth code, e.g., send it to your backend server
      console.log("OAuth code:", code);

      // Optionally, you can use a function to send the code to your backend
      sendCodeToBackend(code).then(() => {
        // Navigate away from the callback page
        navigate("/"); // Or any other route you want to navigate to
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
