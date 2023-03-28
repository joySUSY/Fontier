import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import GlyphEditor from './components/GlyphEditor';
import FontPreview from './components/FontPreview';
import './App.css';

function App() {
  const [fontFile, setFontFile] = useState(null);

  const handleFontFileUpload = (event) => {
    setFontFile(event.target.files[0]);
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <input type="file" onChange={handleFontFileUpload} />
        </Route>
        <Route path="/editor">
          {fontFile && <GlyphEditor fontFile={fontFile} />}
        </Route>
        <Route path="/preview">
          {fontFile && <FontPreview fontFile={fontFile} />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;