import axios from 'axios';

export async function search(keywords) {
  const { data } = await axios.get('https://music.163.com/api/search/get', {
    params: { s: keywords, type: 1, limit: 10 },
    headers: { Referer: 'https://music.163.com' },
  });

  return data.result.songs.map(song => ({
    id: song.id,
    name: song.name,
    artist: song.artists.map(a => a.name).join(', '),
    album: song.album.name,
    pic: song.album.picUrl,
    duration: song.duration,
  }));
}

export async function song(id) {
  const { data } = await axios.get(`https://music.163.com/api/song/detail`, {
    params: { ids: `[${id}]` },
    headers: { Referer: 'https://music.163.com' },
  });

  const s = data.songs[0];
  return {
    id: s.id,
    name: s.name,
    artist: s.ar.map(a => a.name).join(', '),
    album: s.al.name,
    pic: s.al.picUrl,
    url: `https://music.163.com/song/media/outer/url?id=${s.id}.mp3`,
  };
}

export async function lyric(id) {
  const { data } = await axios.get(`https://music.163.com/api/song/lyric`, {
    params: { id, lv: -1, kv: -1, tv: -1 },
  });
  return { id, lrc: data.lrc?.lyric || '' };
}
