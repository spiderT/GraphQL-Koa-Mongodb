function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "omit", // include, same-origin, *omit
    headers: {
      "content-type": "application/json",
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // *client, no-referrer
  }).then((response) => response.json()); // parses response to JSON
}

function getSex(sex) {
  const map = {
    MALE: "男",
    FEMALE: "女",
  };
  return map[sex] || "未知";
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
function formatGQLParams(obj) {
  const arr = [];
  for (const key in obj) {
    let v = obj[key];
    if (v) {
      if (typeof v === "object") {
        v = `${JSON.stringify(v)}`;
      } else if (typeof v === "string") {
        v = `"${v}"`;
      }
      arr.push(`${key}:${v}`);
    }
  }
  return arr.join(",");
}

export { postData, getSex, formatGQLParams };
