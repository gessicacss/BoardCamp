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
    const rentals = await db.query(
      `SELECT rentals.*, customers.name as "customerName", games.name as "gameName"
      FROM rentals JOIN customers ON customers.id = rentals."customerId" 
      JOIN games ON games.id = rentals."gameId";`
    );

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
    const daysOfDelay = dayjs(Date.now()).diff(
      findRental.rows[0].rentDate,
      "day"
    );
    const delayFee = daysOfDelay * findGame.rows[0].pricePerDay;

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
