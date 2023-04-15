const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const formidable = require("formidable");

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      console.log("Parsing form data...");

      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({ fields, files });
      });
    });

    const audioFile = files.audio;

    console.log("Uploading file to S3:", audioFile.name);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: audioFile.name,
      Body: audioFile.path,
    };

    const command = new PutObjectCommand(params);
    const result = await s3.send(command);

    console.log("Successfully uploaded file to S3:", result);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
