import axiosClient from "../util/axiosClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axiosClient
      .get("/home")
      .then((res) => setMsg(res.data.message))
      .catch(() => setMsg("Chưa đăng nhập!"));
  }, []);

  return <h1>{msg}</h1>;
}
