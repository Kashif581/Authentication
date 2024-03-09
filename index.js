import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// ------------- connecting to database ------------
const db = new pg.Client({
  user: "postgres",
  password: "mpo58190",
  database: "Authentication",
  host: "localhost",
  port: 5432

})
db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//      ---------- Home Page ----------------
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// ------------- Login Page ----------------
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// ------------- Register Page -------------
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// ----------- Registering user ----------------
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    // ---------------- query to database to select data ----------------    
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    // ------------- If user already exist ----------------
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    // ------- If user already not exist -----------------
    } else {
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)",[email, password]);
      console.log(result);
      res.render("secrets.ejs");
      }
  } catch (err) {
    console.log(err)
  }
  // console.log(username)
  // console.log(password)
});

// ------------- Logging User -----------------
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {

  // ---------------- query to database to select all data in database ---------------
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    // --------- If user email match with the email in database ---------
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // output: { id: 1, email: 'kashifabdullah581@gamil.com', password: '123' }
      const storedPassword = user.password;
      // --------check if password match----------
      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err)
  }
  
  // console.log(username)
  // console.log(password)

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
