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
  Box,
} from "@mui/material";

function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/permissions")
      .then((res) => setPermissions(res.data))
      .catch((err) => console.error("Error fetching permissions:", err));
  }, []);

  const handleAddPermission = () => {
    if (!newPermission) {
      alert("Please enter a permission name!");
      return;
    }

    axios
      .post("http://localhost:3001/api/permissions", { name: newPermission })
      .then((res) => {
        setPermissions([...permissions, res.data]);
        setOpenAddModal(false);
        setNewPermission("");
      })
      .catch((err) => console.error("Error adding permission:", err));
  };

  const handleDeletePermission = (permissionId) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      axios
        .delete(`http://localhost:3001/api/permissions/${permissionId}`)
        .then(() => setPermissions(permissions.filter((permission) => permission.id !== permissionId)))
        .catch((err) => console.error("Error deleting permission:", err));
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Permission Management
      </Typography>
      <TextField
        label="Search Permissions"
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
        Add Permission
      </Button>
      <Grid container spacing={3}>
        {filteredPermissions.map((permission) => (
          <Grid item xs={12} md={4} key={permission.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{permission.name}</Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeletePermission(permission.id)}
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
          <Typography variant="h6">Add New Permission</Typography>
          <TextField
            label="Permission Name"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddPermission} fullWidth>
            Save Permission
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Permissions;
