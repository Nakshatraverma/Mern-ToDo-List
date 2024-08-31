import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

function Home() {
  const [todo, setTodo] = useState([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoId, setTodoId] = useState("");

  useEffect(()=>{
    axios.get('http://localhost:3001/get')
    .then(result => setTodo(result.data))
    .catch(err => console.log(err))
  },[])

  const addTodo = (text, setText, setTodo) => {
    axios.post('http://localhost:3001/add',{task: text})
    .then(result => {
      setTodo([...todo, result.data]);
      setText("");
    })
    .catch(err => console.log(err))
  }

  const updateTodo = (todoId, text, setTodo, setText, setIsUpdating) => {
    axios.put(`http://localhost:3001/update/${todoId}`,{task: text})
    .then(result => {
      const updatedTodo = todo.map(item => item._id === todoId ? { ...item, task: text } : item);
      setTodo(updatedTodo);
      setIsUpdating(false);
      setText("");
    })
    .catch(err => console.log(err))
  }

  const handleDelete=(id)=>{
    axios.delete('http://localhost:3001/delete/'+id)
    .then(result => {
      location.reload()
    })
    .catch(err => console.log(err))
  }

  const handleCheck = (id) => {
    axios.put('http://localhost:3001/check/'+id)
      .then(result => {
        location.reload()
      })
      .catch(err => console.log(err))
  }

  const handleEdit = (id, text) => {
    setIsUpdating(true);
    setTodoId(id);
    setText(text);
  }

  return (
    <div className="home">
      <h2>ToDo List</h2>
      <form className="create_form">
        <input
          type="text"
          placeholder="Add ToDo..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button
          type="button"
          className="add-btn"
          onClick={
            isUpdating
              ? () => updateTodo(todoId, text, setTodo, setText, setIsUpdating)
              : () => addTodo(text, setText, setTodo)
          }
        >
          {isUpdating ? "UPDATE" : "ADD"}
        </button>
      </form>
      {
        todo.length === 0 ?
        <div><h2>No Record</h2> </div>
        :
        todo.map(todo => (
          <div className='todo-item'>
            <div className='checkbox' onClick={()=> handleCheck(todo._id)}>
              {todo.done ? 
                <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
              :
              <BsCircleFill className='icon'/>
              }
              <p className={todo.done ? "line_through":""}>{todo.task}</p>
            </div>
            
            <div className='trash'>
              <BsFillTrashFill className='icon' onClick={() =>handleDelete(todo._id)}/>
            </div>
            <div className='edit'>
              <BsPencil className='icon' onClick={() => handleEdit(todo._id, todo.task)}/>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default Home;