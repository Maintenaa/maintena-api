export const fsConfig = {
  s3: {
    endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
    accessKey: process.env.S3_ACCESS_KEY || "minioadmin",
    secretKey: process.env.S3_SECRET_KEY || "minioadmin",
    region: process.env.S3_REGION || "us-east-1",
    bucketName: process.env.S3_BUCKET_NAME || "maintena",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  },
};
