import './color_transformer.styles.scss'; 
import { useState } from 'react';

const rgbaStringToObject = (rgbaString) => {
  try {
    // 使用正则表达式匹配括号内的数字
    const match = rgbaString.match(/\(([^)]+)\)/);
    if (!match) return { a: '', r: '', g: '', b: '' };

    const values = match[1].split(',').map((val) => val.trim());
    if (values.length !== 4) return { a: '', r: '', g: '', b: '' };

    const [r, g, b, a] = values;

    return {
      a: isNaN(parseFloat(a).toString()) ? '' : parseFloat(a).toString(),
      r: isNaN(parseInt(r, 10).toString()) ? '' : parseInt(r, 10).toString(),
      g: isNaN(parseInt(g, 10).toString()) ? '' : parseInt(g, 10).toString(),
      b: isNaN(parseInt(b, 10).toString()) ? '' : parseInt(b, 10).toString(),
    };
  } catch (error) {
    return { a: '', r: '', g: '', b: '' }
  }
};

const InputWithLabel = ({ labelText, value, onChange, rows = 1, cols = 5 }) => {
  return (
    <div className={`input-area ${labelText.length > 2 ? 'column' : 'row'}`}>
      <h3>{labelText}</h3>
      <textarea
        className="color-transformer-textarea"
        value={value}
        onChange={onChange}
        rows={rows}
        cols={cols}
      />
    </div>
  );
};

const ColorTransformer = () => {
  const [rgba, setRgba] = useState({ a: '', r: '', g: '', b: '' });
  const [hex, setHex] = useState('');
  const [previewColor, setPreviewColor] = useState('');

  const rgbaToHex = () => {
    try {
      const { a, r, g, b } = rgba;

      if (isNaN(parseFloat(a)) || isNaN(parseInt(r, 10)) || isNaN(parseInt(g, 10)) || isNaN(parseInt(b, 10))) {
        throw new Error('Invalid RGBA format');
      }

      const redHex = parseInt(r, 10).toString(16).padStart(2, '0');
      const greenHex = parseInt(g, 10).toString(16).padStart(2, '0');
      const blueHex = parseInt(b, 10).toString(16).padStart(2, '0');
      const alphaHex = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
      const hexResult = `#${redHex}${greenHex}${blueHex}${alphaHex}`.toUpperCase()

      setHex(hexResult);
      setPreviewColor(hexResult);
    } catch (error) {
      // do nothing
    }
  };

  const hexToRgba = () => {
    try {
      let localHex = hex.replace(/^#/, '');
      if (localHex.length === 6) localHex = localHex + 'FF';
      if (localHex.length !== 8) throw new Error('Invalid HEX format');

      const red = parseInt(localHex.slice(0, 2), 16);
      const green = parseInt(localHex.slice(2, 4), 16);
      const blue = parseInt(localHex.slice(4, 6), 16);
      const alpha = Math.round(parseInt(localHex.slice(6, 8), 16) / 255 * 100) / 100;

      if (
        alpha < 0 || alpha > 1 ||
        red < 0 || red > 255 ||
        green < 0 || green > 255 ||
        blue < 0 || blue > 255
      ) {
        throw new Error('Invalid ARGB values after conversion');
      }
      
      setRgba({ r: red, g: green, b: blue, a: alpha });
      setPreviewColor( `rgba(${red}, ${green}, ${blue}, ${alpha})`);
    } catch (error) {
      // do nothing
    }
  };

  const rgbaTextAreaItem = [
    {label: 'R:', value: rgba.r, onChange: (e) => setRgba({...rgba, r: e.target.value })},
    {label: 'G:', value: rgba.g, onChange: (e) => setRgba({...rgba, g: e.target.value })},
    {label: 'B:', value: rgba.b, onChange: (e) => setRgba({...rgba, b: e.target.value })},
    {label: 'A:', value: rgba.a, onChange: (e) => setRgba({...rgba, a: e.target.value })},
  ]

  return (
    <div className="color-transformer-container">
      <h1>Color Transformer</h1>
      <div className="input-group">
        <div className="rgba-input-group">
          {rgbaTextAreaItem.map((item) => {
            return (
              <InputWithLabel
                labelText={item.label}
                value={item.value}
                onChange={item.onChange}
              />
            )
          })}
        </div>
        <InputWithLabel
          labelText='RGBA'
          value={`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}
          onChange={(e) => setRgba(rgbaStringToObject(e.target.value) || rgba)}
          rows="1"
          cols="21"/>
      </div>

      <div className="button-group">
        <button onClick={rgbaToHex}>rgba to hex</button>
        <div className="color-preview" style={{ backgroundColor: previewColor }} />
        <button onClick={hexToRgba}>hex to rgba</button>
      </div>
      
      <div className="input-group">
        <InputWithLabel
          labelText='Hex'
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          rows="1"
          cols="10"/>
      </div>
    </div>
  )
}

export default ColorTransformer;