import React from "react";
import chatGPTpfp from "../assets/pfp.png";
import pfp from "../assets/pfpMe.jpg";

const Pfp = (props) => {
  return (
    <img
      src={props.isSenderMe ? pfp : chatGPTpfp}
      className={`mt-2 mx-4 w-8 h-8 border-2 rounded-full ${
        props.isSenderMe ? "ml-2" : "mr-2"
      }`}
      alt={
        props.isSenderMe ? "User profile picture" : "ChatGPT profile picture"
      }
    />
  );
};

const Message = (props) => {
  const isSenderMe = props.Message.sender === "Me";
  
  let formattedText = "";
  try{
    formattedText = props.Message.text.replace(/\n/g, '<br />');
  } catch (TypeError) {
  }

  return (
    <div
      className={`flex text-white ${
        isSenderMe ? "justify-end" : "justify-start"
      } items-start mb-2`}
    >
      {!isSenderMe && <Pfp isSenderMe={isSenderMe} />}
      <div
        className={`message-bubble 
          ${isSenderMe ? "bg-blue-500 text-right" : "bg-gray-500 text-left"} 
          p-3 rounded-lg max-w-[50%] w-auto`}
      >
        <div className="message-text" dangerouslySetInnerHTML={{ __html: formattedText }} />
      </div>
      {isSenderMe && <Pfp isSenderMe={isSenderMe} />}
    </div>
  );
};

export default Message;
