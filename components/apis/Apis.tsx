import {SupabaseClient} from '@supabase/supabase-js';

export const uploadImageToCloudinary = async (image: string | File, preset: string = 'fr2fxnpz') => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', preset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/det0mvsek/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading the image', error);
        return null;
    }
};

export const saveUrlToSupabase = async (supabase: SupabaseClient, table: string, url: string, user: {
    user: any
}, ref: boolean, type: string) => {
    console.log("user", user);
    const {data, error} = await supabase
        .from(table)
        .insert([{url: url, user_id: user, ref: ref, type: type}])
        .select();

    if (error) {
        console.error(`Error saving the ${table} URL to Supabase`, error);
        return null;
    } else {
        console.log(`${table} URL saved to Supabase`, data);
        return data;
    }
};


export const generateImage = async (url: string, payload: object) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to generate image:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
};


// // New function to optimize the text prompt
// export const optimizeTextPrompt = async (existingPrompt: string, newUserInputPrompt: string) => {
//     try {
//         const payload = {
//             existing_prompt: existingPrompt,
//             new_user_input_prompt: newUserInputPrompt,
//         };
//
//         const response = await fetch('http://localhost:8001/optimize_text_prompt', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         });
//
//         if (response.ok) {
//             return await response.json();
//         } else {
//             console.error('Failed to optimize text prompt:', response.statusText);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error optimizing text prompt:', error);
//         return null;
//     }
// };