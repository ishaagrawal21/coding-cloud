import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoards,
  createBoard,
  updateBoardApi,
  deleteBoardApi,
  fetchMediums,
  createMedium,
  updateMediumApi,
  deleteMediumApi,
  fetchClasses,
  createClassApi,
  updateClassApi,
  deleteClassApi,
  fetchAcademicYears,
  createAcademicYearApi,
  updateAcademicYearApi,
  deleteAcademicYearApi,
  fetchBooks,
  createBookApi,
  updateBookApi,
  deleteBookApi,
} from "../utills/apiHelper";

function SimpleMasterTable({
  title,
  queryKey,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  fields,
}) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchFn({}),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDialogOpen(false);
      setFormValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateFn({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDialogOpen(false);
      setEditingItem(null);
      setFormValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormValues(
      Object.fromEntries(fields.map((f) => [f.name, item[f.name] || ""]))
    );
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formValues };
    if (editingItem) {
      updateMut.mutate({ id: editingItem._id, payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const list = data?.result || [];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Add {title}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {fields.map((f) => (
                <TableCell key={f.name}>{f.label}</TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              list.map((item) => (
                <TableRow key={item._id}>
                  {fields.map((f) => (
                    <TableCell key={f.name}>{item[f.name]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMut.mutate(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${title}` : `Add ${title}`}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {fields.map((f) => (
              <TextField
                key={f.name}
                label={f.label}
                value={formValues[f.name]}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    [f.name]: e.target.value,
                  }))
                }
                fullWidth
              />
            ))}
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createMut.isLoading || updateMut.isLoading}
              >
                Save
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default function MasterDataPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Master Data Management
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Boards" />
          <Tab label="Mediums" />
          <Tab label="Classes" />
          <Tab label="Academic Years" />
          <Tab label="Books" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        {tab === 0 && (
          <SimpleMasterTable
            title="Boards"
            queryKey={["boards"]}
            fetchFn={fetchBoards}
            createFn={createBoard}
            updateFn={updateBoardApi}
            deleteFn={deleteBoardApi}
            fields={[{ name: "name", label: "Board Name" }]}
          />
        )}
        {tab === 1 && (
          <SimpleMasterTable
            title="Mediums"
            queryKey={["mediums"]}
            fetchFn={fetchMediums}
            createFn={createMedium}
            updateFn={updateMediumApi}
            deleteFn={deleteMediumApi}
            fields={[{ name: "name", label: "Medium Name" }]}
          />
        )}
        {tab === 2 && (
          <SimpleMasterTable
            title="Classes"
            queryKey={["classes"]}
            fetchFn={fetchClasses}
            createFn={createClassApi}
            updateFn={updateClassApi}
            deleteFn={deleteClassApi}
            fields={[{ name: "name", label: "Class Name" }]}
          />
        )}
        {tab === 3 && (
          <SimpleMasterTable
            title="Academic Years"
            queryKey={["academicYears"]}
            fetchFn={fetchAcademicYears}
            createFn={createAcademicYearApi}
            updateFn={updateAcademicYearApi}
            deleteFn={deleteAcademicYearApi}
            fields={[{ name: "name", label: "Academic Year (e.g. 2024-2025)" }]}
          />
        )}
        {tab === 4 && (
          <SimpleMasterTable
            title="Books"
            queryKey={["books"]}
            fetchFn={fetchBooks}
            createFn={createBookApi}
            updateFn={updateBookApi}
            deleteFn={deleteBookApi}
            fields={[
              { name: "book_name", label: "Book Name" },
              { name: "subject", label: "Subject" },
              { name: "publisher", label: "Publisher" },
            ]}
          />
        )}
      </Paper>
    </Box>
  );
}


