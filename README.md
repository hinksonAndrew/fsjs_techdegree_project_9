# fsjs_techdegree_project_9
FullStack JavaScript Techdegree Project 9 - REST API

In this project I will be creating a REST API using express. This will provide a way to administer a school database containing information about users and courses. 

Users can interact with the database to create new courses, retrieve info on existing courses and update or delete existing courses. 

To make changes to the database, it will be requires to log in so the API will allow users to create a new account or retrieve info on an existing account. 

run "npm install" and then "npm run seed" to populate database with seed info. 
run "npm start" to get API started.

# Extra Credit
1) Email validation has been added to the User model to make sure it is formated correctly.
Also email is validated to be unique.

2) /api/users GET route filters out responses of password, createdAt, updatedAt
/api/users POST route checks for and handles SequelizeUniqueConstraint Errors.

3) /api/courses and /api/courses/:id filtered out createdAt and updatedAt
Only the currently authenticated user is the owner of the requested courses. Throws 403 HTTP code.

