import axios from 'axios';

// 搜索歌曲
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

// 获取歌曲信息 + 多音质
export async function song(id, br = 320000) {
  const { data } = await axios.get('https://music.163.com/api/song/enhance/player/url', {
    params: { ids: `[${id}]`, br },
    headers: { Referer: 'https://music.163.com' },
  });

  const song = data.data?.[0];
  if (!song?.url) return { error: '该音质不可用或歌曲下架' };

  return {
    id: song.id,
    br: song.br,
    size: song.size,
    url: song.url,
  };
}

// 获取歌词
export async function lyric(id) {
  const { data } = await axios.get('https://music.163.com/api/song/lyric', {
    params: { id, lv: -1, kv: -1, tv: -1 },
  });
  return { id, lrc: data.lrc?.lyric || '' };
}
