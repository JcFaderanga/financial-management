import { loginWithPassword } from '../services/auth.service.js';

export const login = async (req, res) => {
  const result = await loginWithPassword(req.body);
  res.status(200).json(result);
};

export const getMe = (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
};