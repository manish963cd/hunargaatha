import admin, { ServiceAccount } from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT environment variable is not set."
    );
  }

  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Failed to parse Firebase service account credentials.", error);
    throw new Error("Could not initialize Firebase Admin SDK.");
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
