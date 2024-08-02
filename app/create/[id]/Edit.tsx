import React from 'react';

interface EditProps {
    brushSize: number;
    setBrushSize: React.Dispatch<React.SetStateAction<number>>;
    tool: string;
    setTool: React.Dispatch<React.SetStateAction<string>>;
}

const Edit: React.FC<EditProps> = ({ brushSize, setBrushSize, tool, setTool }) => {
    return (
        <div>
            <div className="mt-4">
                <button onClick={() => setTool('none')}
                        className={`py-2 px-4 rounded ${tool === 'none' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-black'}`}>
                    Select
                </button>
                <button onClick={() => setTool('brush')}
                        className={`py-2 px-4 rounded mr-2 ${tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    Brush
                </button>
                <button onClick={() => setTool('eraser')}
                        className={`py-2 px-4 rounded mr-2 ${tool === 'eraser' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}>
                    Eraser
                </button>
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Brush Size</label>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default Edit;
