const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

const getAll = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const cursor = mongodb.getDatabase().db().collection('users').find();
    const users = await cursor.toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: String(err) });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Users']
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

const createUser = async (req, res) => {
  //#swagger.tags=['Users']
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

const updateUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    // Ajusta los campos a tu modelo real (aquí puse los mismos que en create)
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
    // Si no cambió nada, modifiedCount puede ser 0, igual es éxito semántico:
    res.status(200).json({ _id: id, ...user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: String(err) });
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=['Users']
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