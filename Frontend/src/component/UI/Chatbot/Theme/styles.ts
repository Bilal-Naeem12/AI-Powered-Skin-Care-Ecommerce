export const chatbotCustomStyles = {
 headerStyle: {
  backgroundImage: "linear-gradient(to bottom, #fb64b6, #fb64b6)",
  color: "#FFFFFF",
  borderBottom: "none",
}
,
chatWindowStyle: {
  backgroundColor: "#FFFFFF",
},
  botBubbleStyle: {
    color: "#FFFFFF",
    borderRadius: "18px 18px 18px 4px",
    backgroundColor: "#fb64b6",
    padding: "10px 14px",
    boxShadow: "0px 4px 4px #00000040",
  },
  userBubbleStyle: {
    backgroundColor: "black",
    color: "#FFFFFF",
    borderRadius: "18px 18px 4px 18px",
    boxShadow: "0px 4px 4px #00000040",
  },
chatInputContainerStyle: {
  backgroundColor: "white",
  borderTop: "1px solid #e0e0e0", // light grey top border
  borderLeft: "1px solid #e0e0e0",
  borderRight: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0",
  backdropFilter: "blur(8px)",
  borderRadius: "0 0 12px 12px", // optional: rounded bottom corners
},
  chatInputAreaStyle: {
    minHeight: 25,
    padding: "8px 15px",
    backgroundColor: "#EEEEEE",
    color: "#333333",
    fontSize: "14px",
    outlineColor: "transparent",
    borderRadius: "20px",
  },
  sendButtonStyle: {
    backgroundColor: "black",
    border: "none",
    boxShadow: "none",
    color: "#EEEEEE",
  },
  sendButtonHoveredStyle: {
    backgroundColor: "#373737",
  },
  chatHistoryButtonStyle: {
    color: "#fb64b6",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DAEDF2",
  },
  chatHistoryButtonHoveredStyle: {
    color: "#FFFFFF",
    backgroundColor: "#fb64b6",
  },
};
