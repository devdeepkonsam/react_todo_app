const express = require("express");
const { viewTodo, createTodo, updateTodo, removeTodo } = require("../controller/todo.controller");
const { Auth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/",Auth, viewTodo);
router.post("/", Auth,createTodo);
router.put("/:id", Auth,updateTodo);
router.delete("/:id",Auth, removeTodo);

module.exports = router;
