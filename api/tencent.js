import axios from 'axios';

const QUALITY_MAP = {
  C400: 'M4A（默认）',
  M500: '128K MP3',
  M800: '320K MP3',
  F000: 'FLAC 无损',
};

// 搜索歌曲
export async function search(keywords) {
  const { data } = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
    params: { w: keywords, p: 1, n: 10, format: 'json' },
  });

  return data.data.song.list.map(song => ({
    id: song.songmid,
    name: song.songname,
    artist: song.singer.map(s => s.name).join(', '),
    album: song.albumname,
    duration: song.interval * 1000,
  }));
}

// 获取歌曲链接（多音质）
export async function song(id, quality = 'M800') {
  const prefix = QUALITY_MAP[quality] ? quality : 'C400';
  const ext = prefix === 'F000' ? 'flac' : 'mp3';

  return {
    id,
    quality: QUALITY_MAP[prefix],
    url: `https://ws.stream.qqmusic.qq.com/${prefix}${id}.${ext}?fromtag=0`,
  };
}

// 获取歌词
export async function lyric(id) {
  const { data } = await axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
    params: { songmid: id, format: 'json' },
    headers: { Referer: 'https://y.qq.com' },
  });
  return { id, lrc: data.lyric || '' };
}
