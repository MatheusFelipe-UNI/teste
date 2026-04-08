function removeUndefinedValuesOfObject(obj) {
   const newObj = Object.entries(obj)
      .filter(([key, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => {
         acc[key] = value;
         return acc;
      }, {});

   return newObj;
}

function removeWhitespaceFromObjectValues(obj) {
   const trimObject = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = value.trim();
      return acc;
   }, {});
   return trimObject;
}

module.exports = {
   removeUndefinedValuesOfObject,
   removeWhitespaceFromObjectValues,
};
