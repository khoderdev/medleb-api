import { useState } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function UserForm({
  name,
  setName,
  company,
  setCompany,
  role,
  setRole,
  verified,
  setVerified,
  status,
  setStatus,
  avatar,
  setAvatar,
  handleSubmit,
  handleAvatarChange,
}) {
  const handleNameChange = (event) => setName(event.target.value);
  const handleCompanyChange = (event) => setCompany(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);
  const handleVerifiedChange = (event) => setVerified(event.target.checked);
  const handleStatusChange = (event) => setStatus(event.target.value);

  return (
    <Card>
      <TextField fullWidth label="Name" value={name} onChange={handleNameChange} />
      <TextField fullWidth label="Company" value={company} onChange={handleCompanyChange} />
      <TextField fullWidth label="Role" value={role} onChange={handleRoleChange} />

      <FormControlLabel
        control={<Checkbox checked={verified} onChange={handleVerifiedChange} color="primary" />}
        label="Verified"
      />

      <Select value={status} onChange={handleStatusChange}>
        <MenuItem value="">None</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </Select>

      <input type="file" accept="image/*" onChange={handleAvatarChange} />

      <button onClick={handleSubmit}>Submit</button>
    </Card>
  );
}
