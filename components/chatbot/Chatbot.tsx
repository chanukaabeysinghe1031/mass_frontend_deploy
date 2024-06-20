import { useState } from 'react';

interface ChatbotProps {
    imageUrl: string | null;
    refImageUrl: string | null;
    userId: string;
    modelId: string;
    sessionId: string;
    onImageGenerated: (url: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ imageUrl, refImageUrl, userId, modelId, sessionId, onImageGenerated }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const prepareRequestBody = () => {
        return JSON.stringify({
            text: message,
            image_url: imageUrl,
            ref_image_url: refImageUrl,
            user_id: userId,
            model_id: modelId
        });
    };

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const requestBody = prepareRequestBody();
        console.log('Chatbot input:', requestBody);

        try {
            console.log('Chatbot input:', JSON.parse(requestBody));
            const response = await fetch(`${process.env.NEXT_PUBLIC_NLP_BACKEND_URL}/generate_image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log('Chatbot response:', response);

            if (response.ok) {
                const result = await response.json();
                const generatedImageUrl = result.imageUrl;
                if (generatedImageUrl) {
                    onImageGenerated(generatedImageUrl);
                    setChatHistory([...chatHistory, `You: ${message}`, `Bot: Image generated at ${generatedImageUrl}`]);
                } else {
                    setChatHistory([...chatHistory, `You: ${message}`, `Bot: Failed to generate image`]);
                }
            } else {
                console.error('Failed to generate image:', response.statusText);
                setChatHistory([...chatHistory, `You: ${message}`, `Bot: Failed to generate image`]);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            setChatHistory([...chatHistory, `You: ${message}`, `Bot: Error generating image`]);
        }

        setMessage('');
    };

    return (
        <div className="p-4">
            <div className="bg-gray-100 p-4 rounded mb-4" style={{ height: '300px', overflowY: 'scroll' }}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className="mb-2">
                        {chat}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="w-full bg-blue-500 text-white py-2 rounded">
                Send
            </button>
        </div>
    );
};

export default Chatbot;
