import axios from 'axios';

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

export async function song(id) {
  return {
    id,
    url: `https://ws.stream.qqmusic.qq.com/C400${id}.m4a?fromtag=0`,
  };
}

export async function lyric(id) {
  const { data } = await axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
    params: { songmid: id, format: 'json' },
    headers: { Referer: 'https://y.qq.com' },
  });
  return { id, lrc: data.lyric || '' };
}
