const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

const users = require("./dummy-data.json");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GET All Users
app.get("/api/users", (req, res) => {
  return res.status(200).json(users);
});

// GET User By ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json(user);
});

// CREATE User
app.post("/api/users", (req, res) => {
  const body = req.body;

  if (!body.name || !body.email) {
    return res.status(400).json({
      message: "Name and Email are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    ...body,
  };

  users.push(newUser);

  fs.writeFile(
    "./dummy-data.json",
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to save user",
        });
      }

      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  );
});

// UPDATE User (PATCH)
app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  Object.assign(user, req.body);

  fs.writeFile(
    "./dummy-data.json",
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update user",
        });
      }

      return res.status(200).json({
        message: "User updated successfully",
        user,
      });
    }
  );
});

// DELETE User
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const deletedUser = users.splice(index, 1);

  fs.writeFile(
    "./dummy-data.json",
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete user",
        });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser[0],
      });
    }
  );
});

// HTML Users List
app.get("/users", (req, res) => {
  const html = `
    <h1>Users List</h1>
    <ul>
      ${users
        .map(
          (user) => `
            <li>
              ${user.name} - ${user.email}
            </li>
          `
        )
        .join("")}
    </ul>
  `;

  res.send(html);
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});