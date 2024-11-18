import { useEffect, useState } from "react";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";
import "./App.css";

const AppToaster = Toaster.create({
  position: "top",
})
function App() {
  //  statename  to change the state
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newWebsite, setNewWebsite] = useState("")

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users") // this is the function which will send http requests
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if(name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json ; charset=UTF-8",
          },
          body: JSON.stringify({
            name,
            email,
            website,
          }),
        }
      ).then((response) => response.json())
      .then(data => {
        setUsers([...users, data]);
        AppToaster.show(
          { message: "User added successfully", intent: "success", timeout: 3000 }
        );
      }) 

    }
  }


  //                       1   email Sincere@april.com
  function onChangeHandler(id, key, value) {
        setUsers((users) => {
         return users.map(user => {
           return user.id === id ? {...user, [key]: value} : user;  // ternary operator
          })
        })
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
      {
        method: "PUT",  // to update the particular data
        headers: {
          "Content-Type": "application/json ; charset=UTF-8",
        },
        body: JSON.stringify(user),
      }
    ).then((response) => response.json())
    .then(data => {
      // setUsers([...users, data]);
      AppToaster.show(
        { message: "User updated successfully", intent: "success", timeout: 3000 }
      );
    }) 
  }

   function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
      {
        method: "DELETE",  // to update the particular data
      }
    ).then((response) => response.json())
    .then(data => {
      setUsers((users) => {
          return users.filter((user) =>user.id !== id);
      })  
      AppToaster.show(
        { message: "User deleted successfully", intent: "success", timeout: 3000 }
      );
    })
   }

  return (
    <>
      <div className="App">
        {/* Display User Data    */}
        <table className="bp4-html-table modifier">
          <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email}/></td>
                <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website}/></td>
                <td>
                  <Button intent="primary" onClick={() => updateUser(user.id)}>Update</Button>
                  <Button intent="danger" onClick={() =>deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td> 
                <InputGroup
                 value={newName}
                 onChange={(e) => setNewName(e.target.value)}
                 placeholder="Enter Name..."
                /> 
              </td>
              <td> 
                <InputGroup
                 value={newEmail}
                 onChange={(e) => setNewEmail(e.target.value)}
                 placeholder="Enter Email..."
                /> 
              </td>
              <td> 
                <InputGroup
                 value={newWebsite}
                 onChange={(e) => setNewWebsite(e.target.value)}
                 placeholder="Enter Website..."
                /> 
              </td>
              <td>
                <Button intent="success" onClick={addUser}>Add User</Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
export default App;
