const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

// -------------------------------------------------------------------

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg", { public_id: "olympic_flag" }, function (error, result) {
// 	console.log(result);
// });

// -------------------------------------------------------------------

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;
		// upload file on cloudinary
		const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
		// file has been uploaded
		console.log("file has been uploaded on cloudinary", response.url);
        return response;
	} catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload has failed
        return null;
    }
};
