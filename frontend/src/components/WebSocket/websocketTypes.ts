export interface WebSocketContextType {
  sendMessage: (eventData: { type: string; data: any }) => void;
  updateHandlers: (handlers: {
    [eventType: string]: (data: any) => void;
  }) => void;
}
