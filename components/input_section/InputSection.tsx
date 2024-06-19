import React, { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from "@/lib/supabase/client"; // Ensure the correct path

interface InputSectionProps {
    mode: string;
    selectedModel: string;
    inputValue: string;
    onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGenerateImage: () => void;
    onModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface Model {
    code_name: string;
    show_name: string;
}

const InputSection: React.FC<InputSectionProps> = ({
                                                       mode,
                                                       selectedModel,
                                                       inputValue,
                                                       onModelChange,
                                                       onInputChange,
                                                       onGenerateImage,
                                                       onModeChange,
                                                   }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [optimizationInput, setOptimizationInput] = useState<string>('');
    const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchModels = async () => {
            const { data, error } = await supabase.from('models').select('code_name, show_name').eq('enable', true);
            if (error) {
                console.error('Error fetching models:', error);
            } else {
                setModels(data);
            }
        };

        fetchModels();
    }, []);

    const handleOptimization = async () => {
        try {
            const payload = {
                existing_prompt: inputValue,
                new_user_input_prompt: optimizationInput,
            };

            const response = await fetch('http://localhost:8001/optimize_text_prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Optimized prompt:', result.optimized_prompt);
                console.log('Optimized prompt:', result.optimized_prompt[0]);
                console.log('Optimized prompt:', result.optimized_prompt[0].generated_text);
                setOptimizedPrompt(result.optimized_prompt[0].generated_text);
            } else {
                console.error('Failed to optimize text prompt:', response.statusText);
            }
        } catch (error) {
            console.error('Error optimizing text prompt:', error);
        }
    };

    const applyOptimizedPrompt = () => {
        onInputChange({ target: { value: optimizedPrompt } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="bg-white p-4 border-t border-gray-200">
            <select
                value={mode}
                onChange={onModeChange}
                className="border rounded px-4 py-2 w-full mb-2"
            >
                <option value="Text to Image">Text to Image</option>
                <option value="Text and Image to Image">Text and Image to Image</option>
                <option value="Edit (Inpaint/Outpaint)">Edit (Inpaint/Outpaint)</option>
            </select>
            <select
                value={selectedModel}
                onChange={onModelChange}
                className="border rounded px-4 py-2 w-full mb-2"
            >
                {models.map(model => (
                    <option key={model.code_name} value={model.code_name}>
                        {model.show_name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                className="border rounded px-4 py-2 w-full mb-2"
                placeholder="Enter input for image generation"
            />
            {/*<input*/}
            {/*    type="text"*/}
            {/*    value={optimizationInput}*/}
            {/*    onChange={(e) => setOptimizationInput(e.target.value)}*/}
            {/*    className="border rounded px-4 py-2 w-full mb-2"*/}
            {/*    placeholder="Enter input for optimization"*/}
            {/*/>*/}
            <button
                onClick={handleOptimization}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors mb-2"
            >
                Optimize Prompt
            </button>
            {optimizedPrompt && (
                <div className="bg-gray-100 p-2 rounded mb-2">
                    <p>Optimized Prompt:</p>
                    <p className="font-semibold">{optimizedPrompt}</p>
                </div>
            )}
            <button
                onClick={applyOptimizedPrompt}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors mb-2"
            >
                Apply Optimized Prompt
            </button>
            <button
                onClick={onGenerateImage}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
                Generate Image
            </button>
        </div>
    );
};

export default InputSection;
