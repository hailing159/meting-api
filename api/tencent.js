import express from "express";
import axios from "axios";
const router = express.Router();

// 搜索
router.get("/search", async (req, res) => {
  const { keywords } = req.query;
  try {
    const url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?p=1&n=10&w=${encodeURIComponent(keywords)}&format=json`;
    const { data } = await axios.get(url, {
      headers: { referer: "https://y.qq.com/", origin: "https://y.qq.com" },
    });
    const list = data.data.song.list.map((s) => ({
      id: s.songmid,
      name: s.songname,
      artist: s.singer.map((a) => a.name).join(", "),
      album: s.albumname,
      cover: `https://y.qq.com/music/photo_new/T002R300x300M000${s.albummid}.jpg`,
    }));
    res.json(list);
  } catch {
    res.status(500).json({ error: "QQ search failed" });
  }
});

// 音源
router.get("/url", async (req, res) => {
  const { id, br = 320 } = req.query;
  try {
    const guid = Math.floor(Math.random() * 1000000000);
    const vkeyUrl = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${encodeURIComponent(JSON.stringify({
      req: {
        module: "vkey.GetVkeyServer",
        method: "CgiGetVkey",
        param: {
          guid,
          songmid: [id],
          songtype: [0],
          uin: "0",
          loginflag: 1,
          platform: "20"
        }
      },
      comm: { format: "json", ct: 24, cv: 0 }
    }))}`;

    const { data } = await axios.get(vkeyUrl);
    const purl = data.req.data.midurlinfo[0].purl;
    const host = data.req.data.sip[0];
    res.json({ id, br, url: host + purl });
  } catch {
    res.status(500).json({ error: "QQ url failed" });
  }
});

// 歌词
router.get("/lyric", async (req, res) => {
  const { id } = req.query;
  try {
    const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${id}&format=json&nobase64=1`;
    const { data } = await axios.get(url, {
      headers: { referer: "https://y.qq.com/", origin: "https://y.qq.com" },
    });
    res.json({ lyric: data.lyric });
  } catch {
    res.status(500).json({ error: "QQ lyric failed" });
  }
});

export default router;
