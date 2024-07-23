import React, {useState} from "react";
import { useToast } from "./Toast";
import axios from "axios";

function App() {
  const [youTubeURL, setYouTubeURL] = useState("");
  const [audioOnly, setAudioOnly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("url", youTubeURL);
    formData.append("audio_only", audioOnly);

    DownloadFile("/api/yt-download", formData, setIsProcessing);
  };

  const handleURLChange = (event) => {
    setYouTubeURL(event.target.value);
  };

  const handleAudioOnlyChange = (event) => {
    setAudioOnly(event.target.value);
  };

async function DownloadFile(url, form, setIsProcessing) {
  try {
    setIsProcessing(true);
    showToast("info", "File download request sent.. please wait");
    const response = await axios.post(url, form, {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"];
    let filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
    filename = decodeURIComponent(filename.replace(/utf-8''/i, ""));

    if (filename.startsWith('"') && filename.endsWith('"')) {
      filename = filename.slice(1, -1);
    }

    const dl_url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = dl_url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", "File downloaded successfully");
    setIsProcessing(false);
  } catch (error) {
    showToast("error", error.message);
    setIsProcessing(false);
    console.error("Error:", error);
  }
}

  return (
    <div className="bg-[#282c34] text-center min-h-screen flex items-center justify-center flex-col text-white">
      <h1 className="text-4xl font-bold mb-8">YouTube Downloader</h1>
      <div className="w-[600px]">

      <form className="flex gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste YouTube link here"
          className="rounded-lg text-lg w-full px-4 py-2 text-gray-600"
          required
          onChange={handleURLChange}
          />
        <button type="submit" className="bg-red-700 rounded-lg px-8 text-lg">
          {isProcessing ? (
            <div className="flex gap-2 items-center justify-center">
              <img
                className="w-6 h-6"
                src="/images/tail-spin-light.svg"
                alt="Sending"
                />
              <div> Processing...</div>
            </div>
          ) : (
            <div>Download</div>
          )}
        </button>
      </form>
        <div className="flex justify-start w-full gap-4 py-2">
          <label htmlFor="audio_only">Download Audio Only</label>
          <input
            type="checkbox"
            name="audio_only"
            onChange={handleAudioOnlyChange}
            />
        </div>
            </div>
    </div>
  );
}

export default App;
