import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  fetchBoards,
  fetchMediums,
  fetchClasses,
  fetchAcademicYears,
  fetchBooks,
  createBookSet,
  updateBookSet,
} from "../utills/apiHelper";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BookSetForm({ bookSet, onDone }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [selectedItems, setSelectedItems] = useState([]);

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
  const { data: booksData } = useQuery({
    queryKey: ["books"],
    queryFn: () => fetchBooks({}),
  });

  useEffect(() => {
    if (bookSet) {
      reset({
        board_id: bookSet.board?._id || bookSet.board,
        medium_id: bookSet.medium?._id || bookSet.medium,
        class_id: bookSet.class?._id || bookSet.class,
        year_id: bookSet.year?._id || bookSet.year,
        set_name: bookSet.set_name || "",
      });
      const items =
        bookSet.items?.map((item) => ({
          book_id: item.book?._id || item.book,
          quantity: item.quantity || 1,
        })) || [];
      setSelectedItems(items);
    } else {
      reset({
        board_id: "",
        medium_id: "",
        class_id: "",
        year_id: "",
        set_name: "",
      });
      setSelectedItems([]);
    }
  }, [bookSet, reset]);

  const createMut = useMutation({
    mutationFn: createBookSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookSets"] });
      if (onDone) onDone();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateBookSet({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookSets"] });
      if (onDone) onDone();
    },
  });

  const onSubmit = (data) => {
    const payload = {
      board_id: data.board_id,
      medium_id: data.medium_id,
      class_id: data.class_id,
      year_id: data.year_id,
      set_name: data.set_name,
      books: selectedItems.map((i) => ({
        book_id: i.book_id,
        quantity: Number(i.quantity) || 1,
      })),
    };
    if (bookSet) {
      updateMut.mutate({ id: bookSet._id, payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const mutation = bookSet ? updateMut : createMut;

  const handleAddBook = (bookId) => {
    if (!bookId) return;
    if (selectedItems.some((i) => i.book_id === bookId)) return;
    setSelectedItems((prev) => [...prev, { book_id: bookId, quantity: 1 }]);
  };

  const handleQuantityChange = (bookId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.book_id === bookId ? { ...i, quantity: quantity || 1 } : i
      )
    );
  };

  const handleRemoveBook = (bookId) => {
    setSelectedItems((prev) => prev.filter((i) => i.book_id !== bookId));
  };

  const totalBooks = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      ),
    [selectedItems]
  );

  const selectedBoardId = watch("board_id");
  const selectedMediumId = watch("medium_id");
  const selectedClassId = watch("class_id");
  const selectedYearId = watch("year_id");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {mutation.isError && (
          <Alert severity="error">
            {mutation.error?.response?.data?.message || "An error occurred"}
          </Alert>
        )}
        {mutation.isSuccess && (
          <Alert severity="success">
            Book set {bookSet ? "updated" : "created"} successfully!
          </Alert>
        )}

        <Typography variant="subtitle1" fontWeight={600}>
          Step 1: Select Board, Medium, Class, Academic Year
        </Typography>

        {/* All filters in one responsive row */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <FormControl fullWidth error={!!errors.board_id}>
            <InputLabel>Board</InputLabel>
            <Select
              label="Board"
              defaultValue=""
              {...register("board_id", { required: "Board is required" })}
              value={selectedBoardId || ""}
              onChange={(e) => {
                reset({
                  ...watch(),
                  board_id: e.target.value,
                });
              }}
            >
              {boardsData?.result?.map((b) => (
                <MenuItem key={b._id} value={b._id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
            {errors.board_id && (
              <Typography variant="caption" color="error">
                {errors.board_id.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.medium_id}>
            <InputLabel>Medium</InputLabel>
            <Select
              label="Medium"
              defaultValue=""
              {...register("medium_id", { required: "Medium is required" })}
              value={selectedMediumId || ""}
              onChange={(e) => {
                reset({
                  ...watch(),
                  medium_id: e.target.value,
                });
              }}
            >
              {mediumsData?.result?.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
            {errors.medium_id && (
              <Typography variant="caption" color="error">
                {errors.medium_id.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.class_id}>
            <InputLabel>Class</InputLabel>
            <Select
              label="Class"
              defaultValue=""
              {...register("class_id", { required: "Class is required" })}
              value={selectedClassId || ""}
              onChange={(e) => {
                reset({
                  ...watch(),
                  class_id: e.target.value,
                });
              }}
            >
              {classesData?.result?.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.class_id && (
              <Typography variant="caption" color="error">
                {errors.class_id.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.year_id}>
            <InputLabel>Academic Year</InputLabel>
            <Select
              label="Academic Year"
              defaultValue=""
              {...register("year_id", { required: "Academic year is required" })}
              value={selectedYearId || ""}
              onChange={(e) => {
                reset({
                  ...watch(),
                  year_id: e.target.value,
                });
              }}
            >
              {yearsData?.result?.map((y) => (
                <MenuItem key={y._id} value={y._id}>
                  {y.name}
                </MenuItem>
              ))}
            </Select>
            {errors.year_id && (
              <Typography variant="caption" color="error">
                {errors.year_id.message}
              </Typography>
            )}
          </FormControl>
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
          Step 2: Enter Set Name
        </Typography>
        <TextField
          label="Set Name"
          fullWidth
          {...register("set_name", { required: "Set name is required" })}
          error={!!errors.set_name}
          helperText={errors.set_name?.message}
        />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
          Step 3: Select Books and Quantities
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Books</InputLabel>
            <Select
              label="Books"
              value=""
              onChange={(e) => {
                handleAddBook(e.target.value);
              }}
            >
              {booksData?.result
                ?.filter((b) => !selectedItems.some((i) => i.book_id === b._id))
                .map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.book_name} ({b.subject}) - {b.publisher}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Stack>

        {selectedItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No books selected. Choose books from the dropdown above.
          </Typography>
        ) : (
          <Box>
            {selectedItems.map((item) => {
              const book = booksData?.result?.find((b) => b._id === item.book_id);
              return (
                <Stack
                  key={item.book_id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems="center"
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">
                      {book?.book_name || "Book"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book?.subject} • {book?.publisher}
                    </Typography>
                  </Box>
                  <TextField
                    label="Quantity"
                    type="number"
                    size="small"
                    sx={{ width: 120 }}
                    value={item.quantity}
                    inputProps={{ min: 1 }}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.book_id,
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    helperText="Min 1"
                  />
                  <IconButton color="error" onClick={() => handleRemoveBook(item.book_id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              );
            })}
          </Box>
        )}

        <Typography variant="subtitle1" fontWeight={600}>
          Preview
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Total books (sum of quantities): ${totalBooks}`} color="primary" />
          <Chip label={`Distinct titles: ${selectedItems.length}`} />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading || isSubmitting}
          >
            {mutation.isLoading || isSubmitting
              ? bookSet
                ? "Updating..."
                : "Saving..."
              : bookSet
              ? "Update Set"
              : "Create Set"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              if (onDone) onDone();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}





