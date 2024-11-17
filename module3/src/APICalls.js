

export const handleAudioSubmission = async (output, setOutput, audioBlob) => {
  console.log(audioBlob);

  // Convert blob into mp3
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.mp3");
  formData.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_WHISPER_KEY}`, // Replace with your API key
      },
      body: formData,
    }
  );

  const result = await response.json();
  console.log("Whisper Transcription Result:", result);
  setOutput(output + "\n" + result.text); // Update the UI with the transcription result
};

