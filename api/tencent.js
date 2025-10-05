// api/tencent.js
import axios from "axios";

const QUALITY_MAP = {
  128: "M500",
  320: "M800",
  flac: "F000",
};

// 搜索
export async function search(keywords) {
  const { data } = await axios.get(
    "https://c.y.qq.com/soso/fcgi-bin/client_search_cp",
    {
      params: { w: keywords, p: 1, n: 10, format: "json" },
      headers: { referer: "https://y.qq.com/", origin: "https://y.qq.com" },
    }
  );

  return data.data.song.list.map((s) => ({
    id: s.songmid,
    name: s.songname,
    artist: s.singer.map((a) => a.name).join(", "),
    album: s.albumname,
    duration: s.interval * 1000,
    cover: `https://y.qq.com/music/photo_new/T002R300x300M000${s.albummid}.jpg`,
  }));
}

// 获取真实音源（支持多音质）
export async function song(id, quality = "320") {
  const guid = Math.floor(Math.random() * 1000000000);
  const qualityKey = QUALITY_MAP[quality] || "M500";

  const payload = {
    req: {
      module: "vkey.GetVkeyServer",
      method: "CgiGetVkey",
      param: {
        guid,
        songmid: [id],
        songtype: [0],
        uin: "0",
        loginflag: 1,
        platform: "20",
      },
    },
    comm: { format: "json", ct: 24, cv: 0 },
  };

  const { data } = await axios.get("https://u.y.qq.com/cgi-bin/musicu.fcg", {
    params: { data: JSON.stringify(payload) },
  });

  const info = data.req.data.midurlinfo[0];
  const host = data.req.data.sip[0];
  const purl = info.purl;

  if (!purl) throw new Error("No playable URL");

  return {
    id,
    quality,
    url: host + purl,
  };
}

// 歌词
export async function lyric(id) {
  const { data } = await axios.get(
    "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
    {
      params: { songmid: id, format: "json", nobase64: 1 },
      headers: { referer: "https://y.qq.com/", origin: "https://y.qq.com" },
    }
  );
  return { id, lyric: data.lyric || "" };
}
