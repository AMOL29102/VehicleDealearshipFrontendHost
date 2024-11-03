import axios from "axios";

export async function getUploadURL(file, path) {
  try {
    // console.log("HEllo hi "+fileName);
    const filename = file.name;
    const filetype = file.type;

    const response = await axios.get('https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/upload/generate-upload-url', {
      params: {
        filename,
        filetype, path
      }
    });
    // console.log(response.data.uploadUrl);
    console.log(response)
    return response.data.uploadUrl;
  } catch (error) {
    console.error('Error getting upload URL:', error);
    toast.error("Couldn't get S3 upload URL");
    throw error;
  }
}

export async function uploadToS3(url, file) {
  try {
    const result = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": encodeURI(file.type),
      },
      body: file
    })
    console.log("Uploaded successfully.")
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    toast.error("Couldn't upload to S3");
    throw error;
  }
}


