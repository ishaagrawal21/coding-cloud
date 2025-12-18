import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookSetList from "./BookSetList";
import BookSetForm from "./BookSetForm";

export default function BookSetPage() {
  const [editingBookSet, setEditingBookSet] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditingBookSet(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBookSet(null);
  };

  const handleEdit = (bookSet) => {
    setEditingBookSet(bookSet);
    setOpen(true);
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Book Set Management
      </Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <BookSetList onEdit={handleEdit} onAddClick={handleOpen} />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: 600,
            pb: 2,
          }}
        >
          <Typography variant="h6" component="span">
            {editingBookSet ? "Edit Book Set" : "Add New Book Set"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BookSetForm bookSet={editingBookSet} onDone={handleDone} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}








