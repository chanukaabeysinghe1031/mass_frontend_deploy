// import React, {useEffect} from 'react';
// import {AdvancedImage} from '@cloudinary/react';
// import {Cloudinary} from '@cloudinary/url-gen';
// import {sepia} from "@cloudinary/url-gen/actions/effect";
//
// interface ToolbarProps {
//     mode: string;
//     imageUrl: string;
//     onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onUpload: () => void;
//     uploadedImageUrl: string;
//     onShowModal: () => void;
//     selectedImages: any[];
// }
//
// const Toolbar: React.FC<ToolbarProps> = ({
//                                              mode,
//                                              imageUrl,
//                                              onFileChange,
//                                              onUpload,
//                                              uploadedImageUrl,
//                                              onShowModal,
//                                              selectedImages,
//                                          }) => {
//     const cld = new Cloudinary({
//         cloud: {
//             cloudName: 'det0mvsek'
//         }
//     });
//
//     const myImage = cld.image('cld-sample-5');
//     myImage.effect(sepia());
//
//     useEffect(() => {
//         console.log("Selected images:", selectedImages);
//     }, [selectedImages]);
//
//     return (
//         <div className="w-64 bg-gray-200 p-4">
//             {mode === 'Design' && (
//                 <>
//                     <div className="text-gray-700 font-bold mb-4">Upload Image</div>
//                     <div className="mb-4">
//                         <AdvancedImage cldImg={myImage}/>
//                     </div>
//                     <input type="file" onChange={onFileChange} className="mb-2"/>
//                     <button onClick={onUpload}
//                             className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
//                         Upload Image
//                     </button>
//                     {uploadedImageUrl && <p className="mt-2 text-sm">Image URL: {uploadedImageUrl}</p>}
//                     <div className="mt-4">
//                         <button
//                             onClick={onShowModal}
//                             className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
//                         >
//                             Select Reference Image
//                         </button>
//                         <div className="mt-2">
//                             {selectedImages.map((file) => (
//                                 <div key={file.id} className="mb-2">
//                                     <img src={file.url} alt={file.title} className="w-full rounded"/>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </>
//             )}
//             {mode === 'Edit' && (
//                 <div>
//                     {/* Add editing tools here */}
//                     <p>Edit Toolbar - Add mask creation tools here</p>
//                 </div>
//             )}
//             {mode === 'History' && (
//                 <div>
//                     {/* Show history of the project here */}
//                     <p>History Toolbar - Show project history here</p>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Toolbar;
