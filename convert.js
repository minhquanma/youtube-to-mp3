import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import axios from "axios";

const downloadAsStream = (url) => {
  const fileStream = fs.createWriteStream("outputfile.mp3", {
    highWaterMark: Math.pow(2, 16),
  });
  axios
    .get(url, {
      responseType: "stream",
    })
    .then((response) => {
      response.data.pipe(fileStream, {
        highWaterMark: Math.pow(2, 16),
      });
    });

  ffmpeg().format("mp3").output(fileStream);
};

const convertStreamToMp3 = (stream) => {};
