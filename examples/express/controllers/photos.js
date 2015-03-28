export default {
  index: (req, res) => {
    res.send('photos index');
  },
  show: (req, res) => {
    res.send(`photo ${req.params.id}`);
  }
};
