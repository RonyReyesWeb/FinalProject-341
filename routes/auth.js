const router = require('express').Router();
const passport = require('../config/passport');

const requireOAuthConfig = (req, res, next) => {
  if (!passport.oauthEnabled) {
    return res.status(500).json({ error: 'GitHub OAuth is not configured on this server' });
  }
  next();
};

router.get('/login', requireOAuthConfig, passport.authenticate('github', { scope: ['user:email'] }));

// Both paths work, so an OAuth app registered with either callback URL is fine
router.get(
  ['/github/callback', '/auth/github/callback'],
  requireOAuthConfig,
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => res.redirect('/')
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/'));
  });
});

router.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) return res.status(200).json({ loggedIn: true, user: req.user });
  res.status(200).json({ loggedIn: false });
});

module.exports = router;
