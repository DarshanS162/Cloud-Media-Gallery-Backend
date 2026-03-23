const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    
    const result = await userService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};

const logout = async (req, res) => {
  try {
    const result = await userService.logout(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};

const renewRefreshToken = async (req, res) => {
  try {
    const result = await userService.renewRefreshTokenService(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersService();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const result = await userService.updateUserProfile(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Server error',
      ...(error.status ? {} : { error: error.message }),
    });
  }
}

module.exports = {
  register,
  login,
  deleteUser,
  logout,
  getUserProfile,
  renewRefreshToken,
  getAllUsers,
  updateUserProfile
};