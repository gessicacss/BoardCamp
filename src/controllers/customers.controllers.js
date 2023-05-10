import { db } from "../database/database.connection.js";

export async function createCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [
      cpf,
    ]);
    if (cpfExists.rowCount) return res.status(409).send(`A customer with this cpf already exists.`);

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers;`);
    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
    if(!customer.rowCount) return res.status(404).send(`There's no customer with this id!`);
    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
try {
  if (isNaN(id)) return res.status(404).send('Type a valid ID, it should be a number');
  const { rows } = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
  if(rows.length > 0 && rows[0].id !== Number(id)) return res.status(409).send(`There's a customer with this CPF already!`);

  await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, [name, phone, cpf, birthday, id]);
  res.sendStatus(200);
} catch (err) {
  res.status(500).send(err.message);
}
}