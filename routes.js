'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

const router = express.Router();

// ---- USER ROUTES ----

// Returns the currently authenticated user along with 200 status code.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddress
  });
}));

// Creates new user, sets location header to "/" and returns 201 code.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/').status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// ---- COURSE Routes ----

// Returns a list of all courses including the User that owns each course
//  and a 200 status code
router.get('/courses', asyncHandler( async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt']},
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });
  res.json(courses);
}));

// Returns the corresponding course along with the User that owns it
//  and a 200 status code
router.get('/courses/:id', asyncHandler( async(req, res) => {
  const course = await Course.findAll({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password','createdAt','updatedAt']},
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });
  res.json(course);
}));

// Creates a new course, sets the URL for the new course and returns
//  a 201 status code
router.post('/courses',authenticateUser, asyncHandler( async(req, res) => {
  try {
    const course = await Course.create(req.body);
    res.location(`/api/courses/${course.id}`).status(201).end();
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Updates corresponding course and returns a 204 status code
router.put('/courses/:id',authenticateUser, asyncHandler( async(req, res) => {
  try {
    const currentUser = req.currentUser; // gets current user

    const course = await Course.findByPk(req.params.id);
    if(course.userId === currentUser.id) { // checks to make sure owner and current user are same
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status(403).json({message: 'Not authorized to update record.'}).end();
    }
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Deletes corresponding course and returns a 204 status code
router.delete('/courses/:id',authenticateUser, asyncHandler( async(req,res) => {
  const currentUser = req.currentUser; // gets current user
  
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if(course.userId === currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({message: 'Not authorized to update record.'}).end();
    }
    
  } else {
    res.status(400).json({message: 'Cannont find requested course.'}).end();
  }
}));

module.exports = router;