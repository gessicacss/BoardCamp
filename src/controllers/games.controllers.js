import { db } from "../database/database.connection.js";

export async function createGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    const nameExists = await db.query(`SELECT * FROM games WHERE name=$1`, [
      name,
    ]);
    if (nameExists.rowCount)
      return res.status(409).send(`A game with this name already exists.`);

    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getGames(req, res) {
  try {
    let mainQuery = `SELECT * FROM games `;
    const value = [];

    if (req.query.name){
      mainQuery += `WHERE LOWER(games.name) LIKE LOWER($1);`;
      value.push(`${req.query.name}%`);
    }

    if (req.query.limit && req.query.offset){
      mainQuery += `LIMIT $1 OFFSET $2`;
      value.push(parseInt(req.query.limit));
      value.push(parseInt(req.query.offset));
    } else if (req.query.offset){
      mainQuery += `OFFSET $1;`;
      value.push(parseInt(req.query.offset));
    } else if (req.query.limit){
      mainQuery += `LIMIT $1;`;
      value.push(parseInt(req.query.limit));
    }

    if (req.query.order && req.query.desc === 'true'){
      mainQuery += `ORDER BY ${req.query.order} DESC;`;
    } else if (req.query.order){
      mainQuery += `ORDER BY ${req.query.order};`;
    }

    console.log(mainQuery);

    const games = await db.query(mainQuery, value);
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
