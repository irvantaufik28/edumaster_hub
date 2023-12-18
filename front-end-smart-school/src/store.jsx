import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import classroomSlice from "./features/classroomSlice";
import classMajorSlice from "./features/classMajorSlice";
import studentSlice from "./features/studentSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    classroom: classroomSlice,
    classmajor: classMajorSlice,
    student: studentSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;