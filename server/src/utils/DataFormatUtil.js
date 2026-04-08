function setFirstLetterToUpperCase(text) {
   const lowerCaseText = text.toLowerCase();
   const formattedText = lowerCaseText.replace(/^./, lowerCaseText[0].toUpperCase());
   return formattedText;
}

function removeAllAcentsForString(text) {
   const formattedtext = (text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")).toLowerCase();
   return formattedtext;
}

module.exports = {setFirstLetterToUpperCase, removeAllAcentsForString};