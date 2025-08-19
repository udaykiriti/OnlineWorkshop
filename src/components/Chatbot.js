import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f5f5f5",
  fontFamily: "Helvetica, sans-serif",
  headerBgColor: "#4caf50",
  headerFontColor: "#fff",
  headerFontSize: "20px",
  botBubbleColor: "#4caf50",
  botFontColor: "#fff",
  userBubbleColor: "#e0e0e0",
  userFontColor: "#000",
};

const steps = [
  {
    id: "1",
    message: "Hello! How can I assist you today?",
    trigger: "2",
  },
];

const Chatbot = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} />
    </ThemeProvider>
  );
};

export default Chatbot;
