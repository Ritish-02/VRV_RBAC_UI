import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "" });
  const [editUser, setEditUser] = useState({ id: "", username: "", email: "", role: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axios
      .get("http://localhost:3001/api/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.role) {
      alert("Please fill out all fields!");
      return;
    }

    axios
      .post("http://localhost:3001/api/users", newUser)
      .then((res) => {
        setUsers([...users, res.data]);
        setOpenAddModal(false);
        setNewUser({ username: "", email: "", role: "" });
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setOpenEditModal(true);
  };

  const handleEditUser = () => {
    if (!editUser.username || !editUser.email || !editUser.role) {
      alert("Please fill out all fields!");
      return;
    }

    axios
      .put(`http://localhost:3001/api/users/${editUser.id}`, editUser)
      .then(() => {
        setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
        setOpenEditModal(false);
        setEditUser({ id: "", username: "", email: "", role: "" });
      })
      .catch((err) => console.error("Error editing user:", err));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3001/api/users/${userId}`)
        .then(() => setUsers(users.filter((user) => user.id !== userId)))
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by username, email, or role"
      />

      <Button
        variant="contained"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: "20px" }}
        color="primary"
      >
        Add User
      </Button>

      <Grid container spacing={3}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {user.role}
                </Typography>
                <Box mt={2}>
                  <Button variant="outlined" onClick={() => handleOpenEdit(user)} sx={{ marginRight: 1 }}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={{ background: "white", padding: 3, borderRadius: "8px", width: "400px", margin: "10% auto" }}>
          <Typography variant="h6">Add New User</Typography>
          <TextField
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAddUser} fullWidth>
            Save User
          </Button>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={{ background: "white", padding: 3, borderRadius: "8px", width: "400px", margin: "10% auto" }}>
          <Typography variant="h6">Edit User</Typography>
          <TextField
            label="Username"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleEditUser} fullWidth>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Users;
