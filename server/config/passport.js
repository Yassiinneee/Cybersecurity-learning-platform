import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.example') });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google Strategy if valid credentials exist
const isValidGoogleCreds = GOOGLE_CLIENT_ID && 
  GOOGLE_CLIENT_SECRET && 
  !GOOGLE_CLIENT_ID.includes("YOUR_") && 
  !GOOGLE_CLIENT_SECRET.includes("YOUR_") &&
  GOOGLE_CLIENT_ID !== "mock_google_client_id";

if (isValidGoogleCreds) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `/api/auth/google/callback`,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists in Mongoose DB
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // Also check by email to merge accounts if needed
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await User.findOne({ email: email.toLowerCase() });
            }

            if (user) {
              // Update existing user with Google ID
              user.googleId = profile.id;
              if (email && (email.toLowerCase().includes("yassineklt94") || email.toLowerCase().includes("yassinekalthoum94"))) {
                user.role = "Admin";
              }
              await user.save();
            } else {
              // Create new user profile
              const isAdmin = email && (email.toLowerCase().includes("yassineklt94") || email.toLowerCase().includes("yassinekalthoum94"));
              user = new User({
                googleId: profile.id,
                username: profile.displayName || profile.username || "yassineklt94",
                email: email || "yassineklt94@gmail.com",
                role: isAdmin ? "Admin" : "Student",
                level: 15,
                xp: 8500,
              });
              await user.save();
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  // Use a mock strategy for development if needed, so the app doesn't crash
  passport.use(
    new GoogleStrategy(
      {
        clientID: "mock_google_client_id",
        clientSecret: "mock_google_client_secret",
        callbackURL: `/api/auth/google/callback`,
        skipUserProfile: true,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { 
          id: "google_user_yassineklt94", 
          username: "yassineklt94", 
          email: "yassineklt94@gmail.com",
          level: 15,
          xp: 8500,
          role: "Admin"
        });
      }
    )
  );
}

export default passport;