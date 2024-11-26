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

function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [editRole, setEditRole] = useState({ id: "", name: "", permissions: [] });
  const [searchTerm, setSearchTerm] = useState(""); 
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));

    axios
      .get("http://localhost:3001/api/permissions")
      .then((res) => setPermissions(res.data))
      .catch((err) => console.error("Error fetching permissions:", err));
  }, []);

  const handleAddRole = () => {
    if (!newRole.name || newRole.permissions.length === 0) {
      alert("Please fill out all fields!");
      return;
    }

    axios
      .post("http://localhost:3001/api/roles", newRole)
      .then((res) => {
        setRoles([...roles, res.data]);
        setOpenAddModal(false);
        setNewRole({ name: "", permissions: [] });
      })
      .catch((err) => console.error("Error adding role:", err));
  };

  const handleOpenEdit = (role) => {
    setEditRole(role);
    setOpenEditModal(true);
  };

  const handleEditRole = () => {
    if (!editRole.name || editRole.permissions.length === 0) {
      alert("Please fill out all fields!");
      return;
    }

    axios
      .put(`http://localhost:3001/api/roles/${editRole.id}`, editRole)
      .then(() => {
        setRoles(roles.map((role) => (role.id === editRole.id ? editRole : role)));
        setOpenEditModal(false);
        setEditRole({ id: "", name: "", permissions: [] });
      })
      .catch((err) => console.error("Error editing role:", err));
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      axios
        .delete(`http://localhost:3001/api/roles/${roleId}`)
        .then(() => setRoles(roles.filter((role) => role.id !== roleId)))
        .catch((err) => console.error("Error deleting role:", err));
    }
  };

  
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>
      <TextField
        label="Search Roles"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: "20px" }}
        color="primary"
      >
        Add Role
      </Button>
      <Grid container spacing={3}>
        {filteredRoles.map((role) => (
          <Grid item xs={12} md={4} key={role.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{role.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Permissions: {role.permissions.join(", ")}
                </Typography>
                <Box mt={2}>
                  <Button variant="outlined" onClick={() => handleOpenEdit(role)} sx={{ marginRight: 1 }}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteRole(role.id)}
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
          <Typography variant="h6">Add New Role</Typography>
          <TextField
            label="Role Name"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="permissions-label">Permissions</InputLabel>
            <Select
              labelId="permissions-label"
              multiple
              value={newRole.permissions}
              onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
              renderValue={(selected) => selected.join(", ")}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.name}>
                  {permission.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAddRole} fullWidth>
            Save Role
          </Button>
        </Box>
      </Modal>

      {/* Edit Role Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={{ background: "white", padding: 3, borderRadius: "8px", width: "400px", margin: "10% auto" }}>
          <Typography variant="h6">Edit Role</Typography>
          <TextField
            label="Role Name"
            value={editRole.name}
            onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-permissions-label">Permissions</InputLabel>
            <Select
              labelId="edit-permissions-label"
              multiple
              value={editRole.permissions}
              onChange={(e) => setEditRole({ ...editRole, permissions: e.target.value })}
              renderValue={(selected) => selected.join(", ")}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.name}>
                  {permission.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleEditRole} fullWidth>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Roles;
