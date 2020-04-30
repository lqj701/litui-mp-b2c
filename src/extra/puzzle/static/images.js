const test =
  [{ id: 0, src: 'https://i.loli.net/2018/09/22/5ba60f47d4d60.jpg' },
  { id: 1, src: 'https://i.loli.net/2018/09/22/5ba60f47e8aa2.jpg' },
  { id: 2, src: 'https://i.loli.net/2018/09/22/5ba60f4817a26.jpg' },
  { id: 3, src: 'https://i.loli.net/2018/09/22/5ba60f480718c.jpg' },
  { id: 4, src: 'https://i.loli.net/2018/09/22/5ba60f4805ab6.jpg' },
  { id: 5, src: 'https://i.loli.net/2018/09/22/5ba60f480882f.jpg' },
  { id: 6, src: 'https://i.loli.net/2018/09/22/5ba60f4819300.jpg' },
  { id: 7, src: 'https://i.loli.net/2018/09/22/5ba60f481ab2a.jpg' },
  { id: 8, src: 'https://i.loli.net/2018/09/22/5ba60f481c210.jpg' }]

const star =
  [{ id: 0, src: 'https://i.loli.net/2018/09/23/5ba7457306841.jpg' },
  { id: 1, src: 'https://i.loli.net/2018/09/23/5ba74573197e4.jpg' },
  { id: 2, src: 'https://i.loli.net/2018/09/23/5ba745731b326.jpg' },
  { id: 3, src: 'https://i.loli.net/2018/09/23/5ba7457329072.jpg' },
  { id: 4, src: 'https://i.loli.net/2018/09/23/5ba745732a727.jpg' },
  { id: 5, src: 'https://i.loli.net/2018/09/23/5ba745732b284.jpg' },
  { id: 6, src: 'https://i.loli.net/2018/09/23/5ba745732be04.jpg' },
  { id: 7, src: 'https://i.loli.net/2018/09/23/5ba745733aa6f.jpg' },
  { id: 8, src: 'https://i.loli.net/2018/09/23/5ba745732fda3.jpg' }]

const qiu =
  [{ id: 0, src: 'https://i.loli.net/2018/09/23/5ba74a48b9ce1.jpg' },
  { id: 1, src: 'https://i.loli.net/2018/09/23/5ba74a48d1ecc.jpg' },
  { id: 2, src: 'https://i.loli.net/2018/09/23/5ba74a48e38ba.jpg' },
  { id: 3, src: 'https://i.loli.net/2018/09/23/5ba74a48e6714.jpg' },
  { id: 4, src: 'https://i.loli.net/2018/09/23/5ba74a4901d3f.jpg' },
  { id: 5, src: 'https://i.loli.net/2018/09/23/5ba74a4a41c95.jpg' },
  { id: 6, src: 'https://i.loli.net/2018/09/23/5ba74a4b66c41.jpg' },
  { id: 7, src: 'https://i.loli.net/2018/09/23/5ba74a4b2f3d5.jpg' },
  { id: 8, src: 'https://i.loli.net/2018/09/23/5ba74a4b636f1.jpg' }]


const lumu =
  [{ id: 0, src: 'https://i.loli.net/2018/09/23/5ba74cfc994db.jpg' },
  { id: 1, src: 'https://i.loli.net/2018/09/23/5ba74cfcabd1a.jpg' },
  { id: 2, src: 'https://i.loli.net/2018/09/23/5ba74cfca1c1c.jpg' },
  { id: 3, src: 'https://i.loli.net/2018/09/23/5ba74cfcaa6c8.jpg' },
  { id: 4, src: 'https://i.loli.net/2018/09/23/5ba74cfcad459.jpg' },
  { id: 5, src: 'https://i.loli.net/2018/09/23/5ba74cfcbd012.jpg' },
  { id: 6, src: 'https://i.loli.net/2018/09/23/5ba74cfcb307f.jpg' },
  { id: 7, src: 'https://i.loli.net/2018/09/23/5ba74cfcbeadd.jpg' },
  { id: 8, src: 'https://i.loli.net/2018/09/23/5ba74cfcb44a5.jpg' }]

const images = [star, qiu, lumu]

export default function pickImage() {
  const randomIndex = Math.floor(images.length * Math.random())
  return images[randomIndex]
}