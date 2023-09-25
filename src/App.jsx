import React, { useState } from "react";
import "./App.css";
import AWS from "aws-sdk";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [processedImageUrl, setProcessedImageUrl] = useState("");

 

  const s3 = new AWS.S3();

  //post api - lambda post funktion API GateWay? 
  const handleProcessImage = async () => {
    try {
      const response = await axios.post(
        "https://1arzdoqt8f.execute-api.eu-north-1.amazonaws.com/dev/",
        { body: imageUrl }
      );
      setProcessedImageUrl(response.data);
      setImageUrl("");
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };



  const handleUpload = () => {
    if (!selectedFile) {
      alert("Välj en fil först.");
      return;
    }

    const fileType = selectedFile.name.split(".").pop();

    const prefix = fileType || "övrigt";

    const params = {
      Bucket: "save-animal-pic",
      Key: `${prefix}/${selectedFile.name}`, // Använd prefixet i nyckeln
      Body: selectedFile,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Fel vid uppladdning:", err);
      } else {
        console.log("Bilden laddades upp!:", data.Location);

        // getImages();
      }
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getImages = () => {
    const params = {
      Bucket: "save-animal-pic",
    };
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error("Fel vid hämtning av bilder:", err);
      } else {
        const imageList = data.Contents.map((obj) => obj.Key);
        setImages(imageList);
      }
    });
  };

  return (
    <>
      <h1>Hello world</h1>
      <div className="input-div">
        <input type="file" onChange={handleFileChange} />
      </div>
      <button className="upload btn" onClick={handleUpload}>
        Lägg till bilder
      </button>
      <button className="show btn" onClick={getImages}>
        Visa bilder
      </button>{" "}
      <div className="image-list">
        {images.map((imageName, index) => (
          <img
            key={index}
            src={`https://save-animal-pic.s3.eu-north-1.amazonaws.com/${imageName}`}
            alt={imageName}
          />
        ))}
      </div>
      <div>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          />
        <button onClick={handleProcessImage}>Process Image</button>
        {processedImageUrl && (
          <div>
            <img src={processedImageUrl} alt="Processed Image" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
