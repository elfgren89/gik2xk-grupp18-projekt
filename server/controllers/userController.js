const { User } = require('../models');
const UserController = {
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('Användare hittas inte');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  updateUserById: async (req, res) => {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedUser = await User.findByPk(req.params.id);
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send('Användare hittas inte');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).send('Användare borttagen');
      } else {
        res.status(404).send('Användare hittas inte');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getUserCart: async (req, res) => {
    res.status(501).send('Kan inte hämtas');
  },
};

module.exports = UserController;
