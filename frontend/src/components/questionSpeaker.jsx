import {
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import "../pages/Interview.css";

export default function QuestionSpeaker({
  text,
}) {

  const [speaking, setSpeaking] =
    useState(false);


  // ==================================
  // AUTOMATICALLY SPEAK NEW QUESTION
  // ==================================

  useEffect(() => {

    if (!text) {
      return;
    }

    // Stop any previous question
    window.speechSynthesis.cancel();


    const speech =
      new SpeechSynthesisUtterance(text);


    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;


    speech.onstart = () => {

      setSpeaking(true);

    };


    speech.onend = () => {

      setSpeaking(false);

    };


    speech.onerror = () => {

      setSpeaking(false);

    };


    window.speechSynthesis.speak(
      speech
    );


    // Cleanup when question changes
    return () => {

      window.speechSynthesis.cancel();

      setSpeaking(false);

    };

  }, [text]);


  // ==================================
  // STOP BUTTON
  // ==================================

  const stopSpeaking = () => {

    window.speechSynthesis.cancel();

    setSpeaking(false);

  };


  return (

    <div className="question-speaker">

      {speaking ? (

        <button className="voice-button"
          type="button"
          onClick={stopSpeaking}
        >

          <VolumeX size={18} />

          Stop

        </button>

      ) : (

        <div>

          <Volume2 size={18} />

          Question ready

        </div>

      )}

    </div>

  );
}