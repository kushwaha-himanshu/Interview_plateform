import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

export default function VoiceRecorder({
  onTranscript,
  disabled = false,
}) {

  const recognitionRef = useRef(null);

  const [recording, setRecording] =
    useState(false);

  const [error, setError] =
    useState("");


  const startRecording = () => {

    setError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      setError(
        "Speech recognition is not supported. Please use Chrome or Edge."
      );

      return;
    }


    const recognition =
      new SpeechRecognition();


    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;


    recognition.onstart = () => {

      setRecording(true);

    };


    recognition.onresult = (event) => {

      let transcript = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        if (
          event.results[i].isFinal
        ) {

          transcript +=
            event.results[i][0].transcript;

        }

      }


      if (transcript.trim()) {

        onTranscript(
          transcript.trim()
        );

      }

    };


    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event.error
      );

      setError(
        `Voice recognition error: ${event.error}`
      );

      setRecording(false);

    };


    recognition.onend = () => {

      setRecording(false);

    };


    recognitionRef.current =
      recognition;


    recognition.start();

  };


  const stopRecording = () => {

    if (
      recognitionRef.current
    ) {

      recognitionRef.current.stop();

      recognitionRef.current =
        null;

    }

    setRecording(false);

  };


  return (

    <div className="voice-recorder">

      {!recording ? (

        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
        >

          <Mic size={18} />

          Voice Answer

        </button>

      ) : (

        <button
          type="button"
          onClick={stopRecording}
        >

          <Square size={18} />

          Stop Recording

        </button>

      )}


      {error && (

        <p
          style={{
            color: "#ef4444",
            marginTop: "8px",
          }}
        >
          {error}
        </p>

      )}

    </div>

  );
}