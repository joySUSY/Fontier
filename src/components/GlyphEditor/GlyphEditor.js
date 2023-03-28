import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { parse } from 'opentype.js';
import { getGlyphs, getGlyphByName, getGlyphComponents } from '../utils/glyphUtils';
import { harmonizeCurves, harmonizeSegments, roundCorners } from '../utils/fontUtils';

const GlyphEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GlyphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 500px;
  border: 1px solid black;
`;

const GlyphCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const GlyphEditor = ({ fontFile }) => {
  const [font, setFont] = useState(null);
  const [glyphs, setGlyphs] = useState([]);
  const [selectedGlyph, setSelectedGlyph] = useState(null);
  const [glyphComponents, setGlyphComponents] = useState(null);

  useEffect(() => {
    if (fontFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = event.target.result;
        const font = parse(fontData);
        setFont(font);
        setGlyphs(getGlyphs(font));
      };
      reader.readAsArrayBuffer(fontFile);
    }
  }, [fontFile]);

  useEffect(() => {
    if (font && selectedGlyph) {
      const glyph = getGlyphByName(font, selectedGlyph);
      const components = getGlyphComponents(glyph);
      setGlyphComponents(components);
    }
  }, [font, selectedGlyph]);

  const handleGlyphSelect = (event) => {
    setSelectedGlyph(event.target.value);
  };

  const handleHarmonizeCurves = () => {
    const harmonizedGlyphComponents = harmonizeCurves(glyphComponents);
    setGlyphComponents(harmonizedGlyphComponents);
  };

  const handleHarmonizeSegments = () => {
    const harmonizedGlyphComponents = harmonizeSegments(glyphComponents);
    setGlyphComponents(harmonizedGlyphComponents);
  };

  const handleRoundCorners = () => {
    const roundedGlyphComponents = roundCorners(glyphComponents);
    setGlyphComponents(roundedGlyphComponents);
  };

  return (
    <GlyphEditorContainer>
      <select onChange={handleGlyphSelect}>
        <option value={null}>Select a glyph</option>
        {glyphs.map((glyph) => (
          <option key={glyph.name} value={glyph.name}>
            {glyph.name}
          </option>
        ))}
      </select>
      {selectedGlyph && (
        <GlyphContainer>
          <GlyphCanvas />
        </GlyphContainer>
      )}
      {glyphComponents && (
        <div>
          <button onClick={handleHarmonizeCurves}>Harmonize curves</button>
          <button onClick={handleHarmonizeSegments}>Harmonize segments</button>
          <button onClick={handleRoundCorners}>Round corners</button>
        </div>
      )}
    </GlyphEditorContainer>
  );
};

export default GlyphEditor;