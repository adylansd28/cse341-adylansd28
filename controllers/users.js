const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

/**
 * GET /users
 */
const getAll = async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get all users'
  */
  try {
    const cursor = mongodb.getDatabase().db().collection('users').find();
    const users = await cursor.toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: String(err) });
  }
};

/**
 * GET /users/:id
 */
const getSingle = async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get a user by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
    }
  */
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: String(err) });
  }
};

/**
 * POST /users
 */
const createUser = async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Create a new user'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User payload',
        required: true,
        schema: {
          firstName: 'Carlos',
          lastName: 'Ramirez',
          email: 'carlos.ramirez@example.com',
          favoriteColor: 'Blue',
          birthday: '1990-05-14'
        }
    }
  */
  try {
    const user = {
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      email:     req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday:  req.body.birthday
    };

    const result = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (!result.acknowledged) return res.status(500).json({ message: 'Insert failed' });

    res.status(201).json({ _id: result.insertedId, ...user });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: String(err) });
  }
};

/**
 * PUT /users/:id
 */
const updateUser = async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Replace a user by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User payload (full replacement)',
        required: true,
        schema: {
          firstName: 'Carlos',
          lastName: 'Ramirez',
          email: 'carlos.ramirez@example.com',
          favoriteColor: 'Blue',
          birthday: '1990-05-14'
        }
    }
  */
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = {
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      email:     req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday:  req.body.birthday
    };

    const result = await mongodb.getDatabase().db().collection('users')
      .replaceOne({ _id: new ObjectId(id) }, user);

    if (result.matchedCount === 0) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ _id: id, ...user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: String(err) });
  }
};

/**
 * DELETE /users/:id
 */
const deleteUser = async (req, res) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete a user by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
    }
  */
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const result = await mongodb.getDatabase().db().collection('users')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: String(err) });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
