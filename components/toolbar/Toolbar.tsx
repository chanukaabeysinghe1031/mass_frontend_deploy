import React, { Dispatch, SetStateAction } from 'react';

interface ToolbarProps {
    setBrushSize: Dispatch<SetStateAction<number>>;
    setTool: Dispatch<SetStateAction<string>>;
    setMode: Dispatch<SetStateAction<string>>;
    mode: string;
    dimensions: { width: number; height: number; linkDimensions: boolean };
    setDimensions: Dispatch<SetStateAction<{ width: number; height: number; linkDimensions: boolean }>>;
    imageDimensions: { width: number; height: number };
    setImageDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
    setBrushSize,
    setTool,
    setMode,
    mode,
    dimensions,
    setDimensions,
    imageDimensions,
    setImageDimensions
}) => {
    return (
        <div className="bg-gray-200 p-4 flex flex-col">
            <div>
                <label htmlFor="brushSize">Brush Size:</label>
                <input
                    type="range"
                    id="brushSize"
                    min="1"
                    max="20"
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="tool">Tool:</label>
                <select id="tool" onChange={(e) => setTool(e.target.value)}>
                    <option value="brush">Brush</option>
                    <option value="eraser">Eraser</option>
                </select>
            </div>
            <div>
                <label htmlFor="mode">Mode:</label>
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="Text to Image">Text to Image</option>
                    <option value="Text and Image to Image">Text and Image to Image</option>
                    <option value="Edit (Inpaint/Outpaint)">Edit (Inpaint/Outpaint)</option>
                </select>
            </div>
            <div>
                <label htmlFor="width">Width:</label>
                <input
                    type="number"
                    id="width"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                />
            </div>
            <div>
                <label htmlFor="height">Height:</label>
                <input
                    type="number"
                    id="height"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                />
            </div>
            <div>
                <label htmlFor="linkDimensions">Link Dimensions:</label>
                <input
                    type="checkbox"
                    id="linkDimensions"
                    checked={dimensions.linkDimensions}
                    onChange={(e) => setDimensions({ ...dimensions, linkDimensions: e.target.checked })}
                />
            </div>
        </div>
    );
};

export default Toolbar;
