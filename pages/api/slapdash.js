const axios = require("axios");
const CONFIG = { ACCESS_TOKEN: "access-token" };
const packageIcons = '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m12.89 1.45 8 4c.3332.16558.6136.42083.8097.73704.1961.31622.3001.68088.3003 1.05296v9.53c-.0002.3721-.1042.7367-.3003 1.053-.1961.3162-.4765.5714-.8097.737l-8 4c-.2779.139-.5843.2114-.895.2114s-.6171-.0724-.895-.2114l-8-4c-.33287-.1677-.61225-.4251-.80661-.7432-.19437-.318-.29598-.6841-.29339-1.0568V7.24c.0002-.37208.10419-.73674.30028-1.05296.19609-.31621.47651-.57146.80972-.73704l8-4c.2766-.13742.5812-.20894.89-.20894.3088 0 .6134.07152.89.20894v0Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.32 6.16 12 11l9.68-4.84M12 22.76V11M7 3.5l10 5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

module.exports = async (req, res) => {
  const token = req.headers["access-token"];
  const keywords = req.query.keywords;

  if (req.query['搜索仓库'] === "searchProject") {
    const repos = token
      ? await axios
          .get(
            `https://git.duowan.com/api/v4/projects?private_token=${token}&search=${keywords}`
          )
          .then(({ data }) => data)
      : [];

    const response = {
      inputPlaceholder: "请输入你想搜索的仓库名",
      view: {
        type: "list",
        ranking: false,
        options: repos.map((repo) => {
          return {
            title: repo.name,
            subtitle: repo.description || repo.path_with_namespace || " ",
            action: {
              type: "open-url",
              url: repo.path,
            },
          };
        }),
      },
    };

    res.setHeader("Access-Control-Allow-Headers", "*"); // for config headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(response);
    return;
  } else if (req.query['查看我的MR'] === "listMR") {
    const repos = token
      ? await axios
          .get(
            `https://git.duowan.com/api/v4/merge_requests`, {
              headers: { 'PRIVATE-TOKEN': token }
            }
          )
          .then(({ data }) => data)
      : [];
      
    const response = {
      inputPlaceholder: "请输入你想搜索的仓库名",
      view: {
        type: "list",
        ranking: false,
        options: repos.map((repo) => {
          return {
            title: `${repo.title}(状态: ${repo.state})`,
            subtitle: `source: ${repo.source_branch}, target: ${repo.target_branch}`,
            action: {
              type: "open-url",
              url: repo.web_url,
            },
          };
        }),
      },
    };

    res.setHeader("Access-Control-Allow-Headers", "*"); // for config headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(response);
    return;
  }

  const response = !token
    ? getToken()
    : {
        view: {
          type: "list",
          ranking: false,
          options: [
            {
              icon: packageIcons,
              title: "搜索仓库",
              action: {
                type: "add-param",
                name: "搜索仓库",
                value: "searchProject",
              },
            },
            {
              icon: packageIcons,
              title: "查看我的MR",
              action: {
                type: "add-param",
                name: "查看我的MR",
                value: "listMR",
              },
            },
          ],
        },
      };
  res.setHeader("Access-Control-Allow-Headers", "*"); // for config headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(response);
};

const getToken = () => {
  return {
    config: {
      form: {
        error: "",
        fields: [
          {
            type: "text",
            id: CONFIG.ACCESS_TOKEN,
            label: "Gitlab 访问令牌",
            placeholder: "想啥呢，赶紧贴上你的访问令牌",
            helpText: `去创建你的访问令牌:\n- [访问令牌](https://git.duowan.com/-/profile/personal_access_tokens).\n- **创建个人访问令牌**.\n- 复制令牌并将其粘贴到上面的字段中.`,
          },
        ],
      },
    },
  };
};
