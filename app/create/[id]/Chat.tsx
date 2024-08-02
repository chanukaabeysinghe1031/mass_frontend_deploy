import React from 'react';
import Chatbot from '@/components/chatbot/Chatbot';

interface ChatProps {
    imageUrl: any;
    selectedImage: any;
    user: any;
    selectedModel: string;
    sessionID: string;
    handleImageGenerated: (url: string) => void;
}

const Chat: React.FC<ChatProps> = ({
                                       imageUrl,
                                       selectedImage,
                                       user,
                                       selectedModel,
                                       sessionID,
                                       handleImageGenerated
                                   }) => {
    return (
        <Chatbot
            imageUrl={imageUrl}
            refImageUrl={selectedImage?.url}
            userId={user?.id}
            modelId={selectedModel}
            sessionId={sessionID}
            onImageGenerated={handleImageGenerated}
        />
    );
};

export default Chat;
