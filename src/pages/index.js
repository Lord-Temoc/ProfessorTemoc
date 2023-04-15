import Image from "next/image";
import { Inter } from "next/font/google";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const [audio, setAudio] = useState();
  const [isAudioPicked, setIsAudioPicked] = useState(false);

  const changeHandler = (e) => {
    const audio = e.target.files[0];
    setAudio(audio);
    setIsAudioPicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("audio", audio);

    fetch("http://localhost:3000/api/audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("submitted");
    setIsAudioPicked(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Professor Temoc</h1>
      <input type="file" name="file" onChange={changeHandler} />

      {isAudioPicked ? (
        <div>
          <p>Filename: {audio.name}</p>
          <p>Filetype: {audio.type}</p>
          <p>Size in bytes: {audio.size}</p>
          <p>lastModifiedDate: {audio.lastModifiedDate.toLocaleDateString()}</p>
          <button onClick={handleSubmission}>Submit</button>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
    </main>
  );
}
