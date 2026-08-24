import "dotenv/config";
import {
  initializeApp,
  cert,
  getApps,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";


if (getApps().length === 0) {

    console.log(
  "Firebase Project:",
  process.env.FIREBASE_PROJECT_ID
);

console.log(
  "Firebase Client Email:",
  process.env.FIREBASE_CLIENT_EMAIL
);

console.log(
  "Firebase Private Key exists:",
  !!process.env.FIREBASE_PRIVATE_KEY
);

  initializeApp({

    credential: cert({

      projectId:
        process.env.FIREBASE_PROJECT_ID,

      clientEmail:
        process.env.FIREBASE_CLIENT_EMAIL,

      privateKey:
        process.env.FIREBASE_PRIVATE_KEY
          ?.replace(/\\n/g, "\n"),

    }),

  });

}


export const adminAuth =
  getAuth();