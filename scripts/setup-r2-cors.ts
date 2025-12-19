import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

// Load environment variables
config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "fece-audio";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function setupCORS() {
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedOrigins: [
          "https://fece-gamma.vercel.app",
          "http://localhost:4000", // For local development
        ],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedHeaders: ["*"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3600,
      },
    ],
  };

  try {
    const command = new PutBucketCorsCommand({
      Bucket: R2_BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    });

    await r2Client.send(command);
    console.log("✅ CORS configuration applied successfully!");
    console.log("Allowed origins:", corsConfiguration.CORSRules[0].AllowedOrigins);
  } catch (error) {
    console.error("❌ Error setting CORS configuration:", error);
    throw error;
  }
}

setupCORS();
