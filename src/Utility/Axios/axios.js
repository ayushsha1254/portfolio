import axios from "axios";

// const token = process.env.TOKEN;
// async function hash() {
//   const auth = await bcryptjs.hash(process.env.TOKEN, 12);
//   return auth;
// }
// console.log(env);
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "$2a$12$wekFKA74lN1F/NX5ZW3od.VucddlMllPHYUQU8sbOdyVfXLovNIQ2",
  },
});

export default instance;
