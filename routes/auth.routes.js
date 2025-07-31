const express = require('express');
const {
  registerUserController,
  verificationController,
  loginController,
  logoutController,
  profileController,
  forgetPasswordController,
  resetPasswordController,
  resendVerificationController,
  dashboardController,
} = require('../controllers/auth.controller.js');
const {
  authenticateToken,
  requireVerification,
  redirectIfAuthenticated,
  optionalAuth,
} = require('../middleware/auth.middleware.js');

const authRouter = express.Router();

// Public routes (redirect to dashboard if already authenticated)
authRouter.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login.ejs', {
    title: 'Login',
    description: 'Sign in to your JobSync account to access your personalized job search and mentorship platform.',
    path: '/login',
    image: 'https://jobsync-new.onrender.com/assets/og-login.jpg'
  });
});

authRouter.get('/signup', redirectIfAuthenticated, (req, res) => {
  res.render('signup.ejs', {
    title: 'Sign Up',
    description: 'Create a new JobSync account to start your journey with AI-powered job search and mentorship.',
    path: '/signup',
    image: 'https://jobsync-new.onrender.com/assets/og-signup.jpg'
  });
});

// Auth actions
authRouter.post('/signup', registerUserController);
authRouter.post('/login', loginController);
authRouter.get('/auth/verify/:token', verificationController);
authRouter.post('/forgot-password', forgetPasswordController);

// Reset password routes
authRouter.get('/reset-password/:resetKey', (req, res) => {
  const { resetKey } = req.params;
  res.render('reset-password.ejs', {
    resetKey,
    title: 'Reset Password',
    description: 'Reset your JobSync account password to regain access to your account.',
    path: '/reset-password',
    image: 'https://jobsync-new.onrender.com/assets/og-reset-password.jpg'
  });
});

authRouter.post('/reset-password/:resetKey', resetPasswordController);

// Protected routes (require authentication)
authRouter.get('/dashboard', authenticateToken, async (req, res) => {
  res.render('dashboard.ejs', {
    title: 'Dashboard',
    description: 'Your personalized dashboard for job search and mentorship opportunities.',
    path: '/dashboard',
    image: 'https://jobsync-new.onrender.com/assets/og-dashboard.jpg',
    user: req.user
  });
});

authRouter.get('/profile', authenticateToken, (req, res) => {
  res.render('profile.ejs', {
    title: 'My Profile',
    description: 'View and edit your JobSync profile information.',
    path: '/profile',
    image: 'https://jobsync-new.onrender.com/assets/og-profile.jpg',
    user: req.user
  });
});
authRouter.post('/logout', authenticateToken, logoutController);
authRouter.post('/resend-verification', authenticateToken, resendVerificationController);

module.exports = authRouter;
