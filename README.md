# E-Commerce API
> This is the foundation for an E-Commerce API which will later be used to build a Full-Stack E-Commerce site.



## General Information
- The project is part of the Full-Stack Engineer Curriculum from Codecademy
- The challenge was to build an API providing basic CRUD functionality with authentication/authorization and a proper API documentation
- In this project I created my own local database instead of relying on an external database provider like Supabase to gain experience in developing while working with a local database
- I deviated from the project requirements by building the API in TypeScript instead of JavaScript because I wanted to gain experience handling TypeScript in an Node.js environment
- I also used Prisma as an ORM instead of Sequelize because of its compatibility with TypeScript



## Technologies Used
- Express 4.18.2
- Typescript 4.9.4
- Prisma 4.7.1
- swagger-jsdoc 6.2.8
- swagger-ui-express 4.6.0
- Bcrypt 5.1.0
- Dotenv 16.0.3
- Jsonwebtoken 9.0.0
- Morgan 1.10.0
- TS-Node 10.9.1
- Uuid 9.0.0



## Features
- Register / login / retrieve / edit / delete users
- Retrieve products
- Create / retrieve / update (adding items) / delete carts
- Authentication / authorization (e.g., only registered users can initialize an order) using auth tokens (JWT)
- Obtain / validate refreshTokens by providing an accessToken
- Retrieve / create orders



## Demo
Will follow



## Setup
Will follow



## Learnings
- Designing an API from scatch (which functionality is needed)
- Creating a database model based on the API requirements in Postgres
- Setting up and managing a local Postgres database (using pgAdmin)
- Handling different relationships between tables in Prisma (e.g. Many-to-many relationship between products and categories)
- Querying tables with m:n relationships in Prisma (e.g. using connectOrCreate to consider already existing data)
- Seeding a database of this complexity in Prisma
- Developing an intuition for validating all kinds of possible user inputs (e.g. with respect to types, query & search parameter)
- Building referencable swagger components in a separate yaml file



## Project Status
This project is far from done. I only built the foundation of it. This API is supposed to be used with an accomodating front-end. Before I fix all the details, I want to build the front-end first to have more information about what is required in terms of API functionality. Therefore this project is on hold and will be continued once the front-end is finished. There are several features which are yet to be included e.g., discounts, recommendations, inventory considerations, additional user information (payment information), processing payments etc.



## Acknowledgements
- This project is part of the [Codecademy](https://www.codecademy.com) Full-Stack engineer curriculum.



