import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { parse } from 'opentype.js';
import axios from 'axios';

const FontPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PreviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const PreviewImage = styled.img`
  width: 200px;
  height: 200px;
  border: 1px solid black;
`;

const PreviewName = styled.div`
  margin-top: 10px;
  font-size: 18px;
`;

const FontPreview = ({ fontFile }) => {
  const [font, setFont] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    if (fontFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = event.target.result;
        const font = parse(fontData);
        setFont(font);
        getPreviewData(fontData);
      };
      reader.readAsArrayBuffer(fontFile);
    }
  }, [fontFile]);

  const getPreviewData = async (fontData) => {
    try {
      const response = await axios.post('http://localhost:5000/preview', { fontData });
      setPreviewData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FontPreviewContainer>
      <h1>Font Preview</h1>
      {previewData.length > 0 && (
        <PreviewContainer>
          {previewData.map((previewItem) => (
            <PreviewItem key={previewItem.name}>
              <PreviewImage src={`data:image/png;base64,${previewItem.image}`} />
              <PreviewName>{previewItem.name}</PreviewName>
            </PreviewItem>
          ))}
        </PreviewContainer>
      )}
    </FontPreviewContainer>
  );
};

export default FontPreview;