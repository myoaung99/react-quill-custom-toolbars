import { useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  uploadImage: (formData: FormData) => Promise<string | null>;
  theme?: string;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  theme = "snow",
  placeholder = "Type something...",
  uploadImage,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

  // Custom image upload handler
  const imageHandler = useCallback(() => {
    const editor = quillRef.current!.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const imageUrl = await uploadImage(formData);

        if (imageUrl && editor) {
          const range = editor.getSelection() as unknown as number;
          if (range) {
            editor.insertEmbed(range, "image", imageUrl);
          }
        }
      }
    };
  }, [uploadImage]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image", "link"],
          [
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
              ],
            },
          ],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      modules={modules}
      theme={theme}
    />
  );
};

export default TextEditor;
