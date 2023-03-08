import youtubedl from "youtube-dl-exec";
import fs from "fs";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable, Writable } from "stream";
import * as dotenv from "dotenv";
dotenv.config();

// Config ffmpeg
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);

const downloadAsStream = (url) => {
  axios
    .get(url, {
      headers: { "User-Agent": "Chrome/110.0.0.0" },
      responseType: "stream",
      onDownloadProgress: (progress) => {
        console.log(Math.round(progress.progress * 100, 2) + "%");
      },
    })
    .then((response) => {
      ffmpeg(response.data)
        .inputFormat("webm")
        .toFormat("mp3")
        .save("test.mp3");
    });
};

youtubedl("https://www.youtube.com/watch?v=RKiYBfZKmh0", {
  audioQuality: 1,
  dumpSingleJson: true,
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,
  addHeader: ["referer:youtube.com", "user-agent:googlebot"],
}).then((output) => {
  console.log(output.title);
  output.requested_formats
    .filter((item) => item.audio_ext !== "none")
    .forEach((item) => {
      console.log(item.format);
      console.log(item.url);
      downloadAsStream(item.url);
    });
  const json = JSON.stringify(output);
  fs.writeFile(
    "data.json",
    json,
    {
      encoding: "utf-8",
    },
    (err, data) => {
      console.log(err, data);
    }
  );
});
