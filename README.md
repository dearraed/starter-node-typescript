# Node.js Backend Starter Typescript Project
# Database configuration
1- Execute npm i

2- Execute npm run seed

3- execute commands under keys/instruction.md

4- this basic archticture contains login / logout apis and refresh token api.

5- this basic archtecture contains also :

a) handle of authentication, authorisation.

b) handle of apiError and apiResponse and configuration and handle of jwt and logger.

c) contains basic model and repository.

d) contains helpers to prevent using try catch (async handler), (role) to use the role as middleware, and configuration of (validator).

e) contains (app / config / server).ts files.

# you should copy envexemple to .env
# you should create public and private RSA keys under keys folder 

# Improvements
This starter is from :

https://github.com/janishar/nodejs-backend-architecture-typescript
and the improvments are the following :

1- Add the controller layer.

2- Add custom soft delete.

3- Add pagination on getAll Api.

4- Add and Refactor ApiFeature.

5- Add seeder.

6- Add Swagger Documentation.

