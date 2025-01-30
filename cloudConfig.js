const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer  = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET_CODE,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Cars_DEV',
    //   format: async (req, file) => 'png', // supports promises as well

    // format: async (req, file) => {
    //   const ext = file.mimetype.split('/')[1];
    //   return ['png', 'jpg', 'jpeg'].includes(ext) ? ext : 'jpg';
  // },

  // transformation: [{ width: 800, height: 600, crop: 'limit' }]
       allowedFormats: ["png","jpg","jpeg"],
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });
  const upload = multer({ storage: storage }).array('listing[image]', 5); // Handling multiple file uploads (max 5 files)

  module.exports={cloudinary,storage, upload};