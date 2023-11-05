import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserTypes } from "@/app/types/users";

const initialState: UserTypes = {
  name: "Daniel Yuen Yuen Yuen",
};

export const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    updateUser: (state, action: PayloadAction<UserTypes>) => {
      state = action.payload;
    },
  },
});

// SAMPLE

// export function getEmployees(dispatch: any) {
//   API.fetchEmployees()
//     .then((response) => {
//       const data = response?.data?.data;
//       dispatch(updateEmployeeData(data));
//     })
//     .catch((error) => {
//       console.error(error);
//       throw error;
//     });
// }

export const { updateUser } = userSlice.actions;

export const userState = (state: RootState) => state.users;

export default userSlice.reducer;
