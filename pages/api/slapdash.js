module.exports = async (req, res) => {
  const response = {
    view: {
      type: "list",
      options: [
        {
          title: "Open Slapdash",
          action: {
            type: "open-url",
            url: "https://slapdash.com"
          }
        },
        {
          title: "Copy Heart Emoji",
          action: {
            type: "copy",
            value: "❤️"
          }
        }
      ]
    }
  };
  res.setHeader("Access-Control-Allow-Headers", "*"); // for config headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(response);
}