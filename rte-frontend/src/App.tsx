import { useCallback, useState } from "react";
import "./App.css";
import TextEditor from "./components/TextEditor";

function App() {
  const [value, setValue] = useState("");

  const uploadImage = useCallback(
    async (formData: FormData): Promise<string | null> => {
      try {
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Image uploaded:", data.url);
        return data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    },
    []
  );

  return (
    <div className="grid grid-cols-2 gap-16 p-10">
      <TextEditor onChange={setValue} value={value} uploadImage={uploadImage} />
      <div className="w-full">
        <p className="mb-4 text-3xl font-bold text-center underline">
          Live Preview
        </p>
        <div className="overflow-scroll">
          <div
            className="min-w-full p-4 prose"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
