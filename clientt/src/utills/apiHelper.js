import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Board API functions
export const fetchBoards = async (params) => {
  const res = await API.get("/boards", { params });
  return res.data;
};

export const createBoard = async (payload) => {
  const res = await API.post("/boards", payload);
  return res.data;
};

export const updateBoardApi = async ({ id, payload }) => {
  const res = await API.put(`/boards/${id}`, payload);
  return res.data;
};

export const deleteBoardApi = async (id) => {
  const res = await API.delete(`/boards/${id}`);
  return res.data;
};

// Medium API functions
export const fetchMediums = async (params) => {
  const res = await API.get("/mediums", { params });
  return res.data;
};

export const createMedium = async (payload) => {
  const res = await API.post("/mediums", payload);
  return res.data;
};

export const updateMediumApi = async ({ id, payload }) => {
  const res = await API.put(`/mediums/${id}`, payload);
  return res.data;
};

export const deleteMediumApi = async (id) => {
  const res = await API.delete(`/mediums/${id}`);
  return res.data;
};

// Class API functions
export const fetchClasses = async (params) => {
  const res = await API.get("/classes", { params });
  return res.data;
};

export const createClassApi = async (payload) => {
  const res = await API.post("/classes", payload);
  return res.data;
};

export const updateClassApi = async ({ id, payload }) => {
  const res = await API.put(`/classes/${id}`, payload);
  return res.data;
};

export const deleteClassApi = async (id) => {
  const res = await API.delete(`/classes/${id}`);
  return res.data;
};

// Academic Year API functions
export const fetchAcademicYears = async (params) => {
  const res = await API.get("/academic-years", { params });
  return res.data;
};

export const createAcademicYearApi = async (payload) => {
  const res = await API.post("/academic-years", payload);
  return res.data;
};

export const updateAcademicYearApi = async ({ id, payload }) => {
  const res = await API.put(`/academic-years/${id}`, payload);
  return res.data;
};

export const deleteAcademicYearApi = async (id) => {
  const res = await API.delete(`/academic-years/${id}`);
  return res.data;
};

// Books API functions
export const fetchBooks = async (params) => {
  const res = await API.get("/books", { params });
  return res.data;
};

export const createBookApi = async (payload) => {
  const res = await API.post("/books", payload);
  return res.data;
};

export const updateBookApi = async ({ id, payload }) => {
  const res = await API.put(`/books/${id}`, payload);
  return res.data;
};

export const deleteBookApi = async (id) => {
  const res = await API.delete(`/books/${id}`);
  return res.data;
};

// Book Set API functions
export const createBookSet = async (payload) => {
  const res = await API.post("/book-set/create", payload);
  return res.data;
};

export const fetchBookSets = async (params) => {
  const res = await API.get("/book-set", { params });
  return res.data;
};

export const updateBookSet = async ({ id, payload }) => {
  const res = await API.put(`/book-set/${id}`, payload);
  return res.data;
};

export const deleteBookSet = async (id) => {
  const res = await API.delete(`/book-set/${id}`);
  return res.data;
};
