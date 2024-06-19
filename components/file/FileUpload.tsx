import {useState} from 'react';
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from '@cloudinary/url-gen';
import {sepia} from '@cloudinary/url-gen/actions/effect';

export default function History({model, setModel}) {
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'det0mvsek'
        }
    });

    const myImage = cld.image('cld-sample-5');
    myImage.effect(sepia());

    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'fr2fxnpz'); // Replace with your unsigned preset name

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/det0mvsek/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                setImageUrl(data.secure_url);
            } catch (error) {
                console.error('Error uploading the image', error);
            }
        }
    };

    return (
        <div>
            <AdvancedImage cldImg={myImage}/>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload Image</button>
            {imageUrl && <p>Image URL: {imageUrl}</p>}
        </div>
    );
}
