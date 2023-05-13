import dayjs from "dayjs";
import { db } from "../database/database.connection.js";
import formatDate from "../utils/formatDate.js";

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const findGame = await db.query(`SELECT * FROM games WHERE id=$1`, [
      gameId,
    ]);
    if (!findGame.rowCount)
      return res.status(400).send(`There's no game with this ID.`);

    const findCostumer = await db.query(`SELECT * FROM customers WHERE id=$1`, [
      customerId,
    ]);
    if (!findCostumer.rowCount)
      return res.status(400).send(`There's no costumer with this ID.`);

    const isAvailable = await db.query(
      `SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`,
      [gameId]
    );
    if (isAvailable.rowCount === findGame.rows[0].stockTotal)
      return res.status(400).send(`This game isn't available for renting.`);

    const originalPrice = daysRented * findGame.rows[0].pricePerDay;

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, null, $5, null);`,
      [customerId, gameId, formatDate(), daysRented, originalPrice]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getRentals(req, res) {
  try {
    let mainQuery = `SELECT rentals.*, customers.name as "customerName", games.name as "gameName"
    FROM rentals JOIN customers ON customers.id = rentals."customerId" 
    JOIN games ON games.id = rentals."gameId"`;

    let values = []

    if (req.query.customerId) {
      mainQuery += `WHERE rentals."customerId" = $1`;
      values.push(parseInt(req.query.customerId));
    } else if (req.query.gameId) {
      mainQuery += `WHERE rentals."gameId" = $1`;
      values.push(parseInt(req.query.gameId));
    }

    if (req.query.limit && req.query.offset){
      mainQuery += `LIMIT $1 OFFSET $2`;
      values.push(parseInt(req.query.limit));
      values.push(parseInt(req.query.offset));
    } else if (req.query.offset){
      mainQuery += `OFFSET $1;`;
      values.push(parseInt(req.query.offset));
    } else if (req.query.limit){
      mainQuery += `LIMIT $1;`;
      values.push(parseInt(req.query.limit));
    }
    
    if (req.query.order && req.query.desc === 'true'){
      mainQuery += `ORDER BY "${req.query.order}" DESC;`;
    } else if (req.query.order){
      mainQuery += `ORDER BY "${req.query.order}";`;
    }

    if (req.query.startDate && req.query.status === 'open'){
      mainQuery += `WHERE "returnDate" IS NULL AND "rentDate" >= $1`;
      values.push(req.query.startDate)
    } else if (req.query.startDate && req.query.status === 'closed'){
      mainQuery += `WHERE "returnDate" IS NOT NULL AND "rentDate" >= $1`;
      values.push(req.query.startDate)
    } else if (req.query.startDate){
      mainQuery += `WHERE "rentDate" >= $1`;
      values.push(req.query.startDate)
    } else if (req.query.startDate && req.query.status === 'open'){
      mainQuery += `WHERE "returnDate" IS NULL AND "rentDate" >= $1`;
      values.push(req.query.startDate)
    } else if (req.query.startDate && req.query.status === 'closed'){
      mainQuery += `WHERE "returnDate" IS NOT NULL AND "rentDate" >= $1`;
      values.push(req.query.startDate)
    } else     if (req.query.status === 'closed'){
      mainQuery += `WHERE "returnDate" IS NOT NULL`;
    } else if (req.query.status === 'open'){
      mainQuery += `WHERE "returnDate" IS NULL`;
    }

    const rentals = await db.query(mainQuery, values);

    const listRentals = rentals.rows.map((row) => {
      const { customerName, gameName, ...rowInfo } = row;
      return {
        ...rowInfo,
        customer: {
          id: row.customerId,
          name: customerName,
        },
        game: {
          id: row.gameId,
          name: gameName,
        },
      };
    });

    res.status(200).send(listRentals);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function finalizeRental(req, res) {
  const { id } = req.params;
  try {
    const findRental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [
      id,
    ]);

    if (!findRental.rowCount)
      return res.status(404).send(`There's no rentals with this ID!`);

    if (findRental.rows[0].returnDate !== null)
      return res.status(400).send(`This rental has already been finalized!`);

    const findGame = await db.query(`SELECT * FROM games WHERE id=$1`, [
      findRental.rows[0].gameId,
    ]);

    const daysDiff = dayjs(Date.now()).diff(findRental.rows[0].rentDate, "day");
    const daysOfDelay = Math.abs(daysDiff - findRental.rows[0].daysRented);

    let delayFee = 0;

    if (daysDiff > findRental.rows[0].daysRented) {
      delayFee = daysOfDelay * findGame.rows[0].pricePerDay;
    }

    await db.query(
      `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,
      [formatDate(), delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    if (isNaN(id))
      return res.status(404).send("Type a valid ID, it should be a number");

    const checkId = await db.query(`SELECT * FROM rentals WHERE ID=$1`, [id]);
    if (!checkId.rowCount)
      return res.status(404).send(`There's no rental with this ID!`);

    if (checkId.rows[0].returnDate === null) {
      return res
        .status(400)
        .send(
          `You can't delete this rental since the game wasn't returned yet!`
        );
    }

    await db.query(`DELETE FROM rentals where id=$1`, [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
