import React, { useEffect } from "react";
// import music from "../../Data/music.json";
import Casette from "./Casette";
const Albums = ({ setNowAlbum, nowAlbum, nowPlaying, playing, music }) => {
  const [data, setData] = React.useState();
  const groupDataByAlbum = (data) => {
    const albums = {};
    data.forEach((item) => {
      if (!albums[item.album]) {
        albums[item.album] = [];
      }
      albums[item.album].push(item);
    });
    setData(albums);
    return albums;
  };
  useEffect(() => {
    if (music) groupDataByAlbum(music);
  }, [music]);
  console.log(data);
  //   console.log(groupDataByAlbum(music));
  return (
    <div className=" flex flex-col justify-center flex-wrap p-2 pl-4">
      <div className="dark:text-white text-black text-2xl my-5 pl-6">
        Albums
      </div>
      <div className="flex flex-row justify-start flex-wrap place-items-center gap-x-2 overflow-y-scroll max-h-[80vh] pl-5">
        {data &&
          Object.keys(data).map((album) => {
            return (
              <Casette
                song={data[album][0]}
                setNowAlbum={setNowAlbum}
                nowAlbum={nowAlbum}
                nowPlaying={nowPlaying}
                playing={playing}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Albums;
