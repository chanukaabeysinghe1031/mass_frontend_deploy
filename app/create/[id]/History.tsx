import React, { useState, useEffect } from 'react';

interface HistoryProps {
    messages: any[];
    sessionID: string;
    user: any;
    supabase: any;
}

const History: React.FC<HistoryProps> = ({
                                             messages,
                                             sessionID,
                                             user,
                                             supabase
                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageType, setSelectedImageType] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

    const fetchFeedbacks = async (messageID: string) => {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('message_id', messageID);

        if (error) {
            console.error('Error fetching feedbacks from Supabase', error);
        } else {
            setFeedbacks(data || []);
            const userIds = data.map(feedback => feedback.user_id);
            await fetchUsernames(userIds);
        }
    };

    const fetchUsernames = async (userIds: string[]) => {
        const uniqueUserIds = Array.from(new Set(userIds));
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', uniqueUserIds);

        if (error) {
            console.error('Error fetching usernames from Supabase', error);
        } else {
            const newUsernames = { ...usernames };
            data.forEach(user => {
                newUsernames[user.id] = user.username;
            });
            setUsernames(newUsernames);
        }
    };

    const openModal = (message: any, imageType: string) => {
        setSelectedMessage(message);
        setSelectedImageType(imageType);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageType(null);
    };

    const downloadImage = (imageUrl: string) => {
        console.log('Downloading image:', imageUrl);
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'image.png'; // You can customize the filename here
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading image:', error));
    };

    const toggleStar = async (message: any) => {
        const updatedStar = !message.star;
        const { error } = await supabase
            .from('messages')
            .update({ star: updatedStar })
            .eq('id', message.id);

        if (!error) {
            setMessages(messages.map(msg => msg.id === message.id ? { ...msg, star: updatedStar } : msg));
        }
    };

    const openFeedbackModal = async (message: any) => {
        setSelectedMessage(message);
        await fetchFeedbacks(message.id);
        setFeedbackModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalOpen(false);
    };

    const submitFeedback = async () => {
        const { error } = await supabase
            .from('feedback')
            .insert({
                message_id: selectedMessage.id,
                user_id: user.id,
                like: null,
                comment: feedbackMessage,
            });

        if (!error) {
            setFeedbacks([...feedbacks, {
                message_id: selectedMessage.id,
                user_id: user.id,
                like: null,
                comment: feedbackMessage
            }]);
            setFeedbackMessage('');
        } else {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleLikeDislike = async (likeValue: boolean) => {
        const { error } = await supabase
            .from('feedback')
            .insert({
                message_id: selectedMessage.id,
                user_id: user.id,
                like: likeValue,
                comment: null,
            });

        if (!error) {
            setFeedbacks([...feedbacks, {
                message_id: selectedMessage.id,
                user_id: user.id,
                like: likeValue,
                comment: null
            }]);
        } else {
            console.error('Error submitting feedback:', error);
        }
    };

    const deleteMessage = async (messageID: string) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageID);

        if (!error) {
            setMessages(messages.filter(msg => msg.id !== messageID));
        } else {
            console.error('Error deleting message:', error);
        }
    };

    const getLikeDislikeCounts = () => {
        const likeCount = feedbacks.filter(feedback => feedback.like === true).length;
        const dislikeCount = feedbacks.filter(feedback => feedback.like === false).length;
        return { likeCount, dislikeCount };
    };

    return (
        <div>
            <div className="text-gray-700 font-bold mb-4">Project History</div>
            <div className="overflow-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Star</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Type</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Text</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Generated Image</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Input Image</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Reference Image</th>
                        <th className="py-2 px-4 border-b-2 border-gray-200">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {messages.map((message) => (
                        <React.Fragment key={message.id}>
                            <tr className="border-b">
                                <td className="py-2 px-4">
                                    <button onClick={() => toggleStar(message)} className="text-yellow-500">
                                        {message.star ? '⭐' : '☆'}
                                    </button>
                                </td>
                                <td className="py-2 px-4">{message.type}</td>
                                <td className="py-2 px-4">{message.text}</td>
                                <td className="py-2 px-4">
                                    {message.gen_img_id && (
                                        <img src={message.gen_img_id} alt={`Generated ${message.id}`}
                                             className="w-20 rounded cursor-pointer"
                                             onClick={() => openModal(message, 'gen_img_id')}/>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {message.input_img_id && (
                                        <img src={message.input_img_id} alt={`Input ${message.id}`}
                                             className="w-20 rounded cursor-pointer"
                                             onClick={() => openModal(message, 'input_img_id')}/>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {message.ref_img_id && (
                                        <img src={message.ref_img_id} alt={`Reference ${message.id}`}
                                             className="w-20 rounded cursor-pointer"
                                             onClick={() => openModal(message, 'ref_img_id')}/>
                                    )}
                                </td>
                                <td className="py-2 px-4 flex items-center space-x-2">
                                    <button onClick={() => openFeedbackModal(message)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded">
                                        Feedback
                                    </button>
                                    <button onClick={() => handleLikeDislike(true)}
                                            className="text-green-500 text-2xl">👍
                                    </button>
                                    <button onClick={() => handleLikeDislike(false)}
                                            className="text-red-500 text-2xl">👎
                                    </button>
                                    <button onClick={() => deleteMessage(message.id)}
                                            className="text-red-500 px-2 py-1 rounded">🗑️
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg p-4 z-10 max-w-3xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Image View</h2>
                            <button onClick={closeModal} className="text-black">X</button>
                        </div>
                        <div className="mt-4">
                            {selectedImageType === 'gen_img_id' && selectedMessage.gen_img_id && (
                                <div className="flex flex-col items-center">
                                    <img src={selectedMessage.gen_img_id} alt={`Generated ${selectedMessage.id}`}
                                         className="w-full rounded"/>
                                    <button onClick={() => downloadImage(selectedMessage.gen_img_id)}
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Download
                                    </button>
                                </div>
                            )}
                            {selectedImageType === 'input_img_id' && selectedMessage.input_img_id && (
                                <div className="flex flex-col items-center">
                                    <img src={selectedMessage.input_img_id} alt={`Input ${selectedMessage.id}`}
                                         className="w-full rounded"/>
                                    <button onClick={() => downloadImage(selectedMessage.input_img_id)}
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Download
                                    </button>
                                </div>
                            )}
                            {selectedImageType === 'ref_img_id' && selectedMessage.ref_img_id && (
                                <div className="flex flex-col items-center">
                                    <img src={selectedMessage.ref_img_id} alt={`Reference ${selectedMessage.id}`}
                                         className="w-full rounded"/>
                                    <button onClick={() => downloadImage(selectedMessage.ref_img_id)}
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {feedbackModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg p-4 z-10 max-w-3xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Feedback</h2>
                            <button onClick={closeFeedbackModal} className="text-black">X</button>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button onClick={() => handleLikeDislike(true)} className="text-green-500 text-2xl">👍
                            </button>
                            <span>{getLikeDislikeCounts().likeCount}</span>
                            <button onClick={() => handleLikeDislike(false)} className="text-red-500 text-2xl">👎
                            </button>
                            <span>{getLikeDislikeCounts().dislikeCount}</span>
                        </div>
                        <div className="mt-4">
                            <textarea
                                value={feedbackMessage}
                                onChange={(e) => setFeedbackMessage(e.target.value)}
                                placeholder="Add your comments here..."
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={submitFeedback}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Submit
                            </button>
                            <button onClick={closeFeedbackModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded">Cancel
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-bold mb-2">Previous Feedback</h3>
                            {feedbacks.map(feedback => (
                                feedback.comment && feedback.comment.trim() !== "" && (
                                    <div key={feedback.id} className="bg-gray-100 p-2 rounded mb-2">
                                        <p>
                                            <strong>{usernames[feedback.user_id] || feedback.user_id}</strong>
                                            {feedback.like === true && ' 👍'}
                                            {feedback.like === false && ' 👎'}
                                            {feedback.like === null && ' ✨'} {/* This represents the neutral state */}
                                        </p>
                                        <p>{feedback.comment}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
