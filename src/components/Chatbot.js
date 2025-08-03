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
  // {
  //   id: "2",
  //   user: true,
  //   trigger: "3",
  // },
  // {
  //   id: "3",
  //   message: "You said: {previousValue}. How can I help further?",
  //   trigger: "4",
  // },
  // {
  //   id: "4",
  //   message: "Is there anything else I can assist with?",
  //   trigger: "5",
  // },
  // {
  //   id: "5",
  //   user: true,
  //   trigger: "6",
  // },
  // {
  //   id: "6",
  //   message: "Thank you! Have a great day!",
  //   end: true,
  // },
];

const Chatbot = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} />
    </ThemeProvider>
  );
};

export default Chatbot;
