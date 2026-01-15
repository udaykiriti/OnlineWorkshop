import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f4f7f6",
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  headerBgColor: "#4a90e2",
  headerFontColor: "#fff",
  headerFontSize: "18px",
  botBubbleColor: "#4a90e2",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#2c3e50",
};

const steps = [
  {
    id: "1",
    message: "Hello! Welcome to the Student Workshop Portal. How can I help you today?",
    trigger: "options",
  },
  {
    id: "options",
    options: [
      { value: 1, label: "View Workshops", trigger: "workshops" },
      { value: 2, label: "Registration Help", trigger: "registration" },
      { value: 3, label: "Contact Support", trigger: "contact" },
    ],
  },
  {
    id: "workshops",
    message: "You can view available workshops in the 'Workshop Registration' section of your dashboard.",
    trigger: "more-help",
  },
  {
    id: "registration",
    message: "To register, go to 'Workshop Registration', find a workshop you like, and click 'Register'.",
    trigger: "more-help",
  },
  {
    id: "contact",
    message: "You can reach support at support@studentworkshop.com or call +1-234-567-890.",
    trigger: "more-help",
  },
  {
    id: "more-help",
    message: "Is there anything else I can help you with?",
    trigger: "options-again",
  },
  {
    id: "options-again",
    options: [
      { value: 1, label: "Yes", trigger: "options" },
      { value: 2, label: "No, thank you", trigger: "end" },
    ],
  },
  {
    id: "end",
    message: "You're welcome! Have a great day learning!",
    end: true,
  },
];

const Chatbot = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} headerTitle="Student Assistant" floating={false} width="100%" />
    </ThemeProvider>
  );
};

export default Chatbot;
