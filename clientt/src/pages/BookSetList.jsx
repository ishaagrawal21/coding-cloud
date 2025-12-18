import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookSets,
  deleteBookSet,
  fetchBoards,
  fetchMediums,
  fetchClasses,
  fetchAcademicYears,
} from "../utills/apiHelper";
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function BookSetList({ onEdit, onAddClick }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    board_id: "",
    medium_id: "",
    class_id: "",
    year_id: "",
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookSetToDelete, setBookSetToDelete] = useState(null);

  const { data: boardsData } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetchBoards({}),
  });
  const { data: mediumsData } = useQuery({
    queryKey: ["mediums"],
    queryFn: () => fetchMediums({}),
  });
  const { data: classesData } = useQuery({
    queryKey: ["classes"],
    queryFn: () => fetchClasses({}),
  });
  const { data: yearsData } = useQuery({
    queryKey: ["academicYears"],
    queryFn: () => fetchAcademicYears({}),
  });

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookSets", filters],
    queryFn: () => fetchBookSets(filters),
    refetchOnMount: true,
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteBookSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookSets"] });
      setDeleteDialogOpen(false);
      setBookSetToDelete(null);
    },
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      board_id: "",
      medium_id: "",
      class_id: "",
      year_id: "",
    });
    refetch();
  };

  const handleToggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleDeleteClick = (bookSet) => {
    setBookSetToDelete(bookSet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bookSetToDelete) {
      deleteMut.mutate(bookSetToDelete._id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookSetToDelete(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading book sets
      </Alert>
    );
  }

  return (
    <Box>
      {onAddClick && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ minWidth: { xs: "100%", sm: "auto" } }}
          >
            Add Book Set
          </Button>
        </Box>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        mb={2}
        alignItems="center"
      >
        <FormControl fullWidth size="small">
          <InputLabel>Board</InputLabel>
          <Select
            label="Board"
            value={filters.board_id}
            onChange={(e) => handleFilterChange("board_id", e.target.value)}
          >
            <MenuItem value="">All Boards</MenuItem>
            {boardsData?.result?.map((b) => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Medium</InputLabel>
          <Select
            label="Medium"
            value={filters.medium_id}
            onChange={(e) => handleFilterChange("medium_id", e.target.value)}
          >
            <MenuItem value="">All Mediums</MenuItem>
            {mediumsData?.result?.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        mb={2}
        alignItems="center"
      >
        <FormControl fullWidth size="small">
          <InputLabel>Class</InputLabel>
          <Select
            label="Class"
            value={filters.class_id}
            onChange={(e) => handleFilterChange("class_id", e.target.value)}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classesData?.result?.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Academic Year</InputLabel>
          <Select
            label="Academic Year"
            value={filters.year_id}
            onChange={(e) => handleFilterChange("year_id", e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            {yearsData?.result?.map((y) => (
              <MenuItem key={y._id} value={y._id}>
                {y.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          sx={{ minWidth: { xs: "100%", sm: 120 } }}
        >
          Reset
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Set Name</TableCell>
              <TableCell>Board</TableCell>
              <TableCell>Medium</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Year</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data?.result || data?.result?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No book sets found
                </TableCell>
              </TableRow>
            ) : (
              data?.result?.map((set) => (
                <React.Fragment key={set._id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleExpand(set._id)}
                      >
                        {expandedRow === set._id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{set.set_name}</TableCell>
                    <TableCell>{set.board?.name || "-"}</TableCell>
                    <TableCell>{set.medium?.name || "-"}</TableCell>
                    <TableCell>{set.class?.name || "-"}</TableCell>
                    <TableCell>{set.year?.name || "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        edge="end"
                        onClick={() => onEdit(set)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteClick(set)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === set._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="subtitle1" gutterBottom>
                            Books in this set
                          </Typography>
                          {(!set.items || set.items.length === 0) && (
                            <Typography variant="body2" color="text.secondary">
                              No books configured for this set.
                            </Typography>
                          )}
                          {set.items && set.items.length > 0 && (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Book Name</TableCell>
                                  <TableCell>Subject</TableCell>
                                  <TableCell>Publisher</TableCell>
                                  <TableCell>Quantity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {set.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      {item.book?.book_name || "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.book?.subject || "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.book?.publisher || "-"}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Book Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{bookSetToDelete?.set_name}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMut.isLoading}
          >
            {deleteMut.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}





