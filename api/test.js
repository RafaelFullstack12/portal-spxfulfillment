export default async function handler(req, res) {
  res.status(200).json({ message: 'Teste OK', url: req.url })
}
