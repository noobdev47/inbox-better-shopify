import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_INBOX_BETTER_API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

API.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if (err.response.status === 401) {
      if (err.response.data.message !== undefined) {
        // window.location.href = "/auth/login"
      }
      // store.dispatch(logout());

      localStorage.clear()
    }

    if (err.response.status === 403) {
      if (err.response.data.message !== undefined) {
        // window.location.href = "/auth/login"
      }
      // store.dispatch(logout());

      localStorage.clear()
    }

    if (err.status !== 401) {
      // toast.error(err.response.data.message, {
      //   autoClose: 2500,
      //   closeOnClick: true,
      //   position: "top-right",
      //   hideProgressBar: false,
      // })
      throw err
    }
  }
)

export default API