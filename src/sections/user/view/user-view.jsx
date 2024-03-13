import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import axios from '../../../../axios';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [editing, setEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const avatarInputRef = useRef(null); // Create a ref for the avatar input

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Inside UserPage component
  const resetAvatar = () => {
    setAvatar(null); // Reset avatar state to null
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        // Update existing user
        await axios.put(`/api/users/${editingUserId}`, {
          name,
          company,
          role,
          isVerified: verified,
          status,
          avatarUrl: avatar, // Make sure avatarUrl is correctly populated
        });
      } else {
        // Add new user
        console.log('Avatar before sending request:', avatar); // Log the value of avatar before sending the request
        await axios.post('/api/users', {
          name,
          company,
          role,
          isVerified: verified,
          status,
          avatarUrl: avatar, // Make sure avatarUrl is correctly populated
        });
      }

      // Fetch updated list of users after CRUD operation
      const response = await axios.get('/api/users');
      setUsers(response.data);

      // Reset form inputs and avatar
      setName('');
      setCompany('');
      setRole('');
      setVerified(false);
      setStatus('');
      setAvatar(null); // Reset avatar state to null

      // Clear the avatar input value using its ref
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''; // Clear the input value
      }

      setEditing(false);
      setEditingUserId(null);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);

      // Fetch updated list of users after delete operation
      const response = await axios.get('/api/users');
      setUsers(response.data);

      setUsers(users.filter((user) => user.id !== userId));
      setSelected(selected.filter((selectedItem) => selectedItem.id !== userId));
      if (selectedUserId === userId) {
        setName('');
        setCompany('');
        setRole('');
        setVerified(false);
        setStatus('');
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  // Inside UserPage component
  const handleDeleteSelected = async () => {
    try {
      // Delete all selected users
      await Promise.all(
        selected.map(async (userName) => {
          const selectedUser = users.find((user) => user.name === userName);
          if (selectedUser) {
            await axios.delete(`/api/users/${selectedUser.id}`);
          }
        })
      );

      // Fetch updated list of users after delete operation
      const response = await axios.get('/api/users');
      const updatedUsers = response.data;

      // Update users state with the updated list of users
      setUsers(updatedUsers);

      // Clear selected users
      setSelected([]);
      resetAvatar(); // Reset avatar input
    } catch (error) {
      console.error('Error deleting selected users:', error);
    }
  };

  const handleEdit = async (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser) {
      setName(selectedUser.name);
      setCompany(selectedUser.company);
      setRole(selectedUser.role);
      setVerified(selectedUser.isVerified);
      setStatus(selectedUser.status);
      setEditing(true);
      setEditingUserId(userId);
      setAvatar(selectedUser.avatarUrl);
    }
  };

  const handleNameChange = (event) => setName(event.target.value);
  const handleCompanyChange = (event) => setCompany(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);
  const handleVerifiedChange = (event) => setVerified(event.target.checked);
  const handleStatusChange = (event) => setStatus(event.target.value);
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log('Reader result:', reader.result); // Log the value of reader.result
      setAvatar(reader.result); // Update the avatar state with the data URL
    };
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, userName) => {
    const selectedIndex = selected.indexOf(userName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container sx={{ width: '100%', backgroundColor: '#f0f0f0' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
      </Stack>

      <Card sx={{ width: '100%', backgroundColor: '#ffffff', p: 3, marginBottom: '2rem' }}>
        <Stack spacing={2} alignItems="flex-start">
          <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            width="100%"
          >
            <TextField fullWidth label="Name" value={name} onChange={handleNameChange} />
            <TextField fullWidth label="Company" value={company} onChange={handleCompanyChange} />
            <TextField fullWidth label="Role" value={role} onChange={handleRoleChange} />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            width="100%"
          >
            <FormControlLabel
              control={
                <Checkbox checked={verified} onChange={handleVerifiedChange} color="primary" />
              }
              label="Verified"
            />

            <Select sx={{ width: '50%' }} value={status} onChange={handleStatusChange} fullWidth>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>

            {/* <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              ref={avatarInputRef}
            /> */}

            <Stack direction="row" spacing={1} alignItems="center">
              <Input
                type="file"
                id="avatar-input"
                accept="image/*"
                style={{ display: 'none' }} // Hide the actual file input
                onChange={handleAvatarChange}
                ref={avatarInputRef}
              />
              <label htmlFor="avatar-input">
                <Button
                  variant="outlined"
                  component="span" // Make the button act as a file input trigger
                  startIcon={<CloudUploadIcon />} // Optional: Icon for the button
                >
                  Upload Avatar
                </Button>
              </label>
            </Stack>
          </Stack>

          <Stack width="100%" alignItems="center">
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleSubmit}
              sx={{ width: '20%' }}
            >
              {editing ? 'Update User' : 'New User'}
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ width: '100%', backgroundColor: '#ffffff' }}>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected} // onDeleteSelected prop
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'company', label: 'Company' },
                  { id: 'role', label: 'Role' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      role={row.role}
                      status={row.status}
                      company={row.company}
                      avatarUrl={row.avatarUrl}
                      isVerified={row.isVerified}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      handleEdit={() => handleEdit(row.id)}
                      handleDelete={() => handleDelete(row.id)}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
