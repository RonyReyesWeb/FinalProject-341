const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { upsertFromGithub } = require('../controllers/users');

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
// Accept either name for the callback variable
const CALLBACK_URL = process.env.CALLBACK_URL || process.env.GITHUB_CALLBACK_URL;

// Only register GitHub OAuth when credentials exist (keeps tests and local dev working without them)
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && CALLBACK_URL) {
  passport.use(
    new GitHubStrategy(
      { clientID: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET, callbackURL: CALLBACK_URL },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Save/update the user in the "users" collection
          const user = await upsertFromGithub(profile);
          // Store only what we need in the session
          done(null, {
            _id: String(user._id),
            githubId: user.githubId,
            username: user.username,
            displayName: user.displayName
          });
        } catch (err) {
          done(err);
        }
      }
    )
  );
  passport.oauthEnabled = true;
} else {
  if (process.env.NODE_ENV !== 'test') console.warn('GitHub OAuth is not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / CALLBACK_URL missing).');
  passport.oauthEnabled = false;
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
