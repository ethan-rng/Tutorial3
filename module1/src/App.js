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
      setLoading(true)
      try {
        const response = await fetch(process.env.REACT_APP_YOUR_API_KEY + 'random-greeting', {
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json', // Indicate the content type
          },
          body: JSON.stringify(currMessage), // Convert the data to JSON
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json()
        console.log(data)
        return data.message
  
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false);
      }
    }
  
    // TODO: Implement this function
    const handleSubmit = async () => {
      if (currSender != "" && currMessage != "" && currSender != "GPT") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Me", text: currMessage },
        ]);
    
        const response = await postToGPT();
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "GPT", text: response },
        ]);
        setCurrMessage("");
      }
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
