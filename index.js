import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC ");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }
  catch(err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
    // items.push({ title: item });
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  try{
    const result = await db.query("UPDATE items SET title = ($1) WHERE id = $2", [title,id]);
    res.redirect("/")
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try{
    const result = await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
