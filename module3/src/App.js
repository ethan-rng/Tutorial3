import "./App.css";
import { useState, useRef } from "react";
import WFNLogo from "./assets/WFNcolour.png";
import { handleAudioSubmission, handlePictureSubmission } from "./APICalls";


function App() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(""); // Stores the image URL
  const [audioUrl, setAudioUrl] = useState(""); // Stores the audio URL
  const [blobAudio, setBlobAudio] = useState(null)

  const [mediaRecorder, setMediaRecorder] = useState(null); // Media Recorder
  const videoRef = useRef(null);  // Video Recorder
  const canvasRef = useRef(null); // Canvas

  const [output, setOutput] = useState("");

 
  // Start microphone recording
  const handleStartMic = async () => {
    try {
      setLoading(true);
      setAudioUrl(""); // Clear the old audio URL
      setBlobAudio(null); // Clear the old audio Blob
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const mp3Url = URL.createObjectURL(audioBlob);
        setBlobAudio(audioBlob); 
        setAudioUrl(mp3Url); // Save the audio URL for playback
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stop microphone recording
  const handleStopMic = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop recording
      setMediaRecorder(null);
    }
  };


  // Start camera feed
  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Take a picture from the video feed
  const handleTakePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  
      // Convert canvas to Blob and store it
      canvasRef.current.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setResult(imageUrl); // Save the image URL for display
      }, "image/png");
    }
  };
  

  return (
    <div className="bg-[#282c34] w-full h-full flex flex-col items-center text-white">
      <img
        className="fixed top-8 left-8 h-10 w-auto"
        src={WFNLogo}
        alt="wfn logo"
      />

      <div className="h-[60vh] flex flex-col items-center justify-end w-full gap-y-4 px-5">
        <h1 className="text-white">Audio Playback</h1>
        {audioUrl && (
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
        <button
          className={`w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleStartMic}
        >
          Start Recording
        </button>
        <button
          className={`w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleStopMic}
        >
          Stop Recording
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3"
          onClick={() => {handleAudioSubmission(output, setOutput, blobAudio)}}
        >
          Submit Audio Sample for Analysis
        </button>
      </div>

      <div className="h-[70vh] flex flex-col justify-end w-full gap-y-4 px-5">
        <img className='h-2/3 object-contain rounded-l' src={result} alt='take an image first to see result'/>
        <button
          className="w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3"
          onClick={handleStartCamera}
        >
          Start Camera
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3"
          onClick={handleTakePicture}
        >
          Take Picture
        </button>
        <button
          className="w-full bg-blue-500 hover:bg-blue-500/40 rounded-2xl py-3"
          onClick={() => {handlePictureSubmission(output, setOutput, result)}}
        >
          Submit Picture For Analysis
        </button>
        <video ref={videoRef} className="hidden" width="640" height="480" />
        <canvas ref={canvasRef} className="hidden" width="640" height="480" />
      </div>



      <div className="h-[50vh] flex flex-col w-full justify-end  py-10 px-10">
        <h1 className="text-white">Your Result</h1>
        <textarea
          className="flex min-h-[80px] h-2/3 text-black w-full rounded-md border-input px-3 text-sm overflow-x-hidden resize-none"
          value={output}
        />
      </div>
    </div>
  );
}

export default App;
