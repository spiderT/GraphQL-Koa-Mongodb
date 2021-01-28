/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
function dealObjectValue(obj) {
  const param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (let key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      param[key] = obj[key];
    }
  }
  return param;
}

module.exports = { dealObjectValue };
