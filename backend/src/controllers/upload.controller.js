import { configureCloudinary, cloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadImages = asyncHandler(async (req, res) => {
  const configuredCloudinary = configureCloudinary() || cloudinary;

  if (!configuredCloudinary?.uploader) {
    res.status(501);
    throw new Error("Cloudinary is not configured yet");
  }

  if (!req.files?.length) {
    res.status(400);
    throw new Error("No images provided");
  }

  const uploads = await Promise.all(
    req.files.map((file) =>
      new Promise((resolve, reject) => {
        const stream = configuredCloudinary.uploader.upload_stream(
          {
            folder: "boi-station/books",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          },
        );

        stream.end(file.buffer);
      }),
    ),
  );

  res.status(201).json({
    success: true,
    data: uploads,
  });
});
