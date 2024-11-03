const {deleteObject,listImagesInFolder,getObjectURL} = require('../amazonS3/s3config.js')


async function handleGetNotice(req, res) {
    try {

        // S3 folder structure for images (e.g., regisNum/VehicleImages/)
        const NoticeFolder = `Notices/`;

        // Fetch image keys from the S3 folder
        const NoticeImagesKeys = await listImagesInFolder(NoticeFolder);

        // Generate signed URLs for other images, starting from 1
        const NoticeImagesPromises = NoticeImagesKeys.map(async (key, index) => {
            return await getObjectURL(key); // Generate URL for each image key
        });

       // Wait for all other image promises to resolve
        const NoticeImages = await Promise.all(NoticeImagesPromises);

        res.json(NoticeImages);

    } catch (error) {
        console.log(`${error} : Error occurred while fetching the notice images`);
        res.status(500).send("An error occurred while fetching the images");
    }
}

async function handleDeleteNotice(req, res) {
    const { uniqueID } = req.query;  // Now using query parameter

    if (!uniqueID) {
        return res.status(400).send("uniqueID number is required");
    }

    try {
        // Delete the image with the specified serialnum
        const deletePath = `Notices/${uniqueID}`;
            await deleteObject(deletePath);

        // Return success message if the image was deleted
        res.send(`Notice image with serial number ${uniqueID} deleted successfully`);
    } catch (error) {
        console.log(`${error} : Error occurred while deleting the notice image`);
        res.status(500).send("An error occurred while deleting the notice image");
    }
}


module.exports = {
    handleGetNotice,
    handleDeleteNotice
};
