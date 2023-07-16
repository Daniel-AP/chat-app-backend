/* eslint-disable camelcase */
import cloudinary from "cloudinary";

export const cloudinaryConnection = () => {

    const configCredentials = {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        secure: true
    };
        
    cloudinary.v2.config(configCredentials);

};