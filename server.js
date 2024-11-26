const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let users = [
  { id: uuidv4(), username: "Ritish", email: "ritish@example.com", role: "Admin" },
  { id: uuidv4(), username: "Raj", email: "raj@example.com", role: "User" },
];

let roles = [
  { id: uuidv4(), name: "Admin", permissions: ["Read", "Write", "Delete"] },
  { id: uuidv4(), name: "User", permissions: ["Read"] },
];

let permissions = [
  { id: uuidv4(), name: "Read" },
  { id: uuidv4(), name: "Write" },
  { id: uuidv4(), name: "Delete" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { username, email, role } = req.body;

  if (!username || !email || !role) {
    return res.status(400).json({ error: "Username, Email, and Role are required" });
  }

  const roleExists = roles.find((r) => r.name === role);
  if (!roleExists) {
    return res.status(400).json({ error: "Selected role does not exist" });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    role,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!username || !email || !role) {
    return res.status(400).json({ error: "Username, Email, and Role are required" });
  }

  const roleExists = roles.find((r) => r.name === role);
  if (!roleExists) {
    return res.status(400).json({ error: "Selected role does not exist" });
  }

  user.username = username;
  user.email = email;
  user.role = role;

  res.json(user);
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

app.get("/api/roles", (req, res) => {
  res.json(roles);
});

app.post("/api/roles", (req, res) => {
  const { name, permissions } = req.body;

  if (!name || !permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ error: "Role name and permissions (array) are required" });
  }

  const invalidPermissions = permissions.filter(
    (perm) => !permissions.some((p) => p.name === perm)
  );

  if (invalidPermissions.length < 0) {
    return res.status(400).json({ error: "One or more permissions are invalid" });
  }

  const newRole = {
    id: roles.length+1,
    name,
    permissions,
  };

  roles.push(newRole);
  res.status(201).json(newRole);
});

app.put("/api/roles/:id", (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  const role = roles.find((r) => r.id === id);

  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }

  if (!name || !permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ error: "Role name and permissions (array) are required" });
  }

  const invalidPermissions = permissions.filter(
    (perm) => !permissions.some((p) => p.name === perm)
  );

  if (invalidPermissions.length < 0) {
    return res.status(400).json({ error: "One or more permissions are invalid" });
  }

  role.name = name;
  role.permissions = permissions;

  res.json(role);
});

app.delete("/api/roles/:id", (req, res) => {
  const { id } = req.params;
  const roleIndex = roles.findIndex((r) => r.id === id);

  if (roleIndex === -1) {
    return res.status(404).json({ error: "Role not found" });
  }

  roles.splice(roleIndex, 1);
  res.status(204).send();
});

app.get("/api/permissions", (req, res) => {
  res.json(permissions);
});

app.post("/api/permissions", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  const exists = permissions.find((perm) => perm.name === name);
  if (exists) {
    return res.status(400).json({ error: "Permission already exists" });
  }

  const newPermission = {
    id: uuidv4(),
    name,
  };

  permissions.push(newPermission);
  res.status(201).json(newPermission);
});

app.put("/api/permissions/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const permission = permissions.find((p) => p.id === id);

  if (!permission) {
    return res.status(404).json({ error: "Permission not found" });
  }

  if (!name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  permission.name = name;

  res.json(permission);
});

app.delete("/api/permissions/:id", (req, res) => {
  const { id } = req.params;
  const permissionIndex = permissions.findIndex((p) => p.id === id);

  if (permissionIndex === -1) {
    return res.status(404).json({ error: "Permission not found" });
  }

  permissions.splice(permissionIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});