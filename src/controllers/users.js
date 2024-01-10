import { Router } from "express";
import crypto from "crypto";

const routes = Router();
const users = [];

routes.post("/", (req, res) => {
  const { name, email } = req.body;
  const user = { name, email, id: crypto.randomUUID() };
  users.push(user);
  res.status(201).send(user);
});

routes.get("/", (req, res) => {
  res.status(200).json(users);
});

routes.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).send({ error: "User not found" });
  }
  res.status(200).send(user);
});

routes.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex < 0) {
    res.status(404).send({ error: "User not found" });
  }
  const user = { name, email, id };
  users[userIndex] = user;
  res.status(200).send(user);
});

routes.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex < 0) {
    res.status(404).send({ error: "User not found" });
  }
  users.splice(userIndex, 1);
  res.status(204).send();
});

export default routes;
