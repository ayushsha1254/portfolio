import React from "react";
import axios from "axios";
import { useEffect } from "react";
import main from "../Data/main.json";
const Terminal = () => {
  const [data, setData] = React.useState(null);
  useEffect(() => {
    axios
      .get("https://www.youtube.com/feeds/videos.xml", {
        params: {
          channel_id: main.youtube_id,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  }, []);
  return (
    <div>
      <div>{data}</div>
    </div>
  );
};

export default Terminal;
