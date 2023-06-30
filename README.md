# BoardCamp

## About

This is a simple API for managing game rentals. It allows you to perform CRUD operations on games, customers, and rentals. The API provides endpoints for creating, reading, updating, and deleting records.

## Technologies

<p align='center'>
<img style='margin: 2px;' src='https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white'/>
<img style='margin: 2px;' src='https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black'/>
<img style='margin: 2px;' src='https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB'/>
<img style='margin: 2px;' src='https://img.shields.io/badge/postgres-%234ea94b.svg?style=for-the-badge&logo=postgresql&logoColor=white'>
<img style='margin: 2px; width:70px' src='https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white/'>
</p>

## Routes

#### <span style='font-weight:bold;'>GET</span> /games
Retrieves a list of games. Use query Parameters to filter the names:
```
        Example: /games?name=ba
    Returns games with names starting with "ba".
```

It should return a list like this:

```
{
[
  {
    id: 1,
    name: 'Banco Imobiliário',
    image: 'http://',
    stockTotal: 3,
    pricePerDay: 1500
  },
  {
    id: 2,
    name: 'Detetive',
    image: 'http://',
    stockTotal: 1,
    pricePerDay: 2500
  },
]
}
```

#### <span style='font-weight:bold;'>POST</span> /Games

A route that will creates a new game. Name is required and stock and price should be more than 0, in case it isn't it'll respond a 400 status error code. If there's a game with this name already it'll return a 409 status code.

```
{
  name: 'Banco Imobiliário',
  image: 'http://www.imagem.com.br/banco_imobiliario.jpg',
  stockTotal: 3,
  pricePerDay: 1500
}
```

#### <span style='font-weight:bold;'>GET</span> /customers

Retrieves a list of games. Use query Parameters to filter the names:
```
        Example: /customers?cpf=012
    Returns a list of customers with cpf starting with "012".
```

It should return a list like this:
```
[
  {
    id: 1,
    name: 'João Alfredo',
    phone: '21998899222',
    cpf: '01234567890',
    birthday: '1992-10-05'
  },
  {
    id: 2,
    name: 'Maria Alfreda',
    phone: '21998899221',
    cpf: '12345678910',
    birthday: '1994-12-25'
  },
]
```

#### <span style='font-weight:bold;'>POST</span> /customers
A route that will creates a new customer. CPF should be a string with 11 characters, phone should be a string with either 10 or 11 number, name is required, and birthday should be a valid name, in case one of this or all of this is wrong it'll return a 400 status code error. If there's a customer with this cpf already it'll return a 409 status code. Request body should be:

```
{
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-25'
}
```

#### <span style='font-weight:bold;'>GET</span> /customers/:id
Retrieves the customer with this id. If there's no customer with this id it'll return a 404 status code error. Responds with a body in the following format:

```
{
  id: 1,
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-05'
}
```

#### <span style='font-weight:bold;'>PUT</span> /customers/:id
Updates a specific customer by ID.  CPF should be a string with 11 characters, phone should be a string with either 10 or 11 number, name is required, and birthday should be a valid name, in case one of this or all of this is wrong it'll return a 400 status code error. If there's a customer with this cpf already (one that's not this customer) it'll return a 409 status code. The request body should be:

```
{
  name: 'João Alfredo',
  phone: '21998899223',
  cpf: '01234567890',
  birthday: '1992-10-25'
}
```

#### <span style='font-weight:bold;'>GET</span> /rentals
Retrieves a list of rentals. Use query Parameters to filter either with the gameId or customerId:
```
        Example: /rentals?gameId=1
    Returns a list of all rentals with a game with id "1".
```

It should return a list like this:

```
[
  {
    id: 1,
    customerId: 1,
    gameId: 1,
    rentDate: '2021-06-20',
    daysRented: 3,
    returnDate: null, // it'll change to a date when its returned
    originalPrice: 4500,
    delayFee: null,
    customer: {
     id: 1,
     name: 'João Alfredo'
    },
    game: {
      id: 1,
      name: 'Banco Imobiliário'
    }
  }
]
```

#### <span style='font-weight:bold;'>POST</span> /rentals
A route that will creates a new rental. The rentDate and originalPrice should be automatically created the moment the rental is created, rentDate with the date when the person ranted the game and originalPrice with the game's original price. ReturnDate and DelayFee should be null. In case there's no client or game with the specified id it'll return a 400 status code error. DaysRented should be bigger than zero. In case the game's not available, it'll return a 400 status code error. Request body should be like this:

```
{
  customerId: 1,
  gameId: 1,
  daysRented: 3
}
```

#### <span style='font-weight:bold;'>POST</span> /rentals/:id/return
A route that will return the rental, changing the returnDate and the delayFee in case it was a late return. The delayFee should be the original price multiplied by how many days it was delayed. If there's no rental with the given id, it'll return a 404 status code error. If the rental was already returned, it'll return a 400 status code error.


## How to run

To run this, you'll have to install PostgreSQL and create a table to acess the database.

1. Clone this repository
2. Install the dependencies

```
npm i
```

3. Create a **.env** file in the root directory and add the necessary environment variables. This file should not be committed to GitHub for security reasons. It should look like this:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
PORT=3000;

    <username>: your PostgreSQL username.
    <password>: your PostgreSQL password.
    <database_name>: database name which you want to connect.
```

4. Create a Database with the following information:

table rentals:
```
{
  id: 1,
  customerId: 1,
  gameId: 1,
  rentDate: '2021-06-20',    // when the rental was made
  daysRented: 3,             // how long the customer rented the game
  returnDate: null,          // when the customer returned the game (null if it wasn't returned yet)
  originalPrice: 4500,       // total price (days rented multiplied by the original price)
  delayFee: null             // delay fee (null if it wasn't returned yet, 0 if there's none)
}
```
table customers:
```
{
  id: 1,
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-25'
}
```

table games:
```
{
  id: 1,
  name: 'Banco Imobiliário',
  image: 'http://',
  stockTotal: 3,
  pricePerDay: 1500,
}
```

5. Run the back-end with

```
npm start
```

6. Access http://localhost:3000 on your browser to run the API.
