import React, { useState } from 'react';
import './App.css';
import AWS from 'aws-sdk';

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  
AWS.config.update({ 
  accessKeyId: '', 
  secretAccessKey: '', 
  region: '', 
  }); 

const s3 = new AWS.S3();

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

        getImages();
      }
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  return (
    <>
      <h1>Hello world</h1>
      <div className="input-div">
        <input type="file" onChange={handleFileChange} />
      </div>
      <button className="upload-btn" onClick={handleUpload}>
        Lägg till bilder
      </button>
    </>
  );
}

export default App;
