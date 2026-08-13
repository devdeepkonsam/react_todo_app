const Todo = require("../model/todo.model");

const viewTodo = async(req,res) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.find({user: userId}).sort({createdAt: -1});
        return res.status(200).json({message: "Todos fetched successfully", todos}); 
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const createTodo = async(req,res)=> {
    try {
        const {title} = req.body;
        if(!title){
            return res.status(400).json({message: "Title is required"});
        }
        const newTodo = new Todo({title,user: req.user.id});
        await newTodo.save();
        return res.status(201).json({message: "Todo created successfully", todo: newTodo});

    } catch (error) {
        return res.status(500).json({message:error.message})   
    }
}


const updateTodo = async(req,res)=>{
    try {
        const {title,completed} = req.body;
        const todo = await Todo.findOne({_id:req.params.id, user:req.user.id});
        if(!todo){
            return res.status(404).json({message: "Todo not found"});
        }
        if(title !== undefined){
            todo.title = title;
        }
        if(completed !== undefined){
            todo.completed = completed;
        }
        await todo.save();
        return res.status(200).json({message: "Todo updated successfully", todo});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const removeTodo = async(req,res) =>{
    try {
        const todo = await Todo.findOneAndDelete({_id: req.params.id, user:req.user.id})
        if(!todo){
            return res.status(404).json({message: "Todo not found"});
        }
        return res.status(200).json({message: "Todo deleted successfully", todo});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {viewTodo, createTodo, updateTodo, removeTodo}