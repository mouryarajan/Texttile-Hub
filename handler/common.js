const isDefined = (value) => {
    if (typeof value !== "undefined") {
      return true;
    }
    return false;
  };
  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

  module.exports={isDefined,isEmptyObject};