const command = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    Object.values(CONFIG).join(", ")
  );

  res.json({
    view: {
      type: "list",
      options: [
        {
          title: "slapdash",
          action: {
            type: "open-url",
            url: "https://slapdash.com",
          },
        },
        {
          title: "Copy Heart Emoji",
          action: {
            type: "copy",
            value: "❤️",
          },
        },
      ],
    },
  });
};

export default command;