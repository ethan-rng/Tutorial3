import "./App.css";
import { Textarea } from "./components/TextArea";
import { Button } from "./components/Button";
import { useState } from "react";
import Message from "./components/Message";
import WFNLogo from "./assets/WFNcolour.png";

function App() {
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState("");
  const [currSender, setCurrSender] = useState("  ");
  const [loading, setLoading] = useState(false);
  
    // TODO: Implement this function
    const postToGPT = async () => {
      
    }
  
    // TODO: Implement this function
    const handleSubmit = async () => {
    
    };

  return (
    <div className="bg-[#282c34] w-full h-full flex flex-col items-center">
      <img
        className="fixed top-8 left-8 h-10 w-auto"
        src={WFNLogo}
        alt="wfn logo"
      />

      <div className="h-[80vh] flex flex-col w-4/5 py-16 overflow-scroll overflow-x-hidden scrollbar-hidden">
        {messages.map((message, index) => (
          <Message key={index} Message={message} />
        ))}
      </div>


      <div className="h-[20vh] w-4/5 flex flex-col items-center gap-y-5">
        <Textarea
          placeholder="Type your message here."
          className="resize-none"
          value={currMessage}
          onChange={(e) => setCurrMessage(e.target.value)}
        />

        {/* // TODO: Add Loading State here */}
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-500/40 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
        >
          Send message
        </Button>
      </div>
    </div>
  );
}

export default App;
