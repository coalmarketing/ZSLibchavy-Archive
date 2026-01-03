module.exports = {
  name: "Základní škola a mateřská škola Libchavy",
  email: "skola@zslibchavy.cz",
  ico: "75017890",
  phoneForTel: "+420465582203",
  phoneFormatted: "+420 465 582 203",
  address: {
    lineOne: "Dolní Libchavy 153",
    city: "Libchavy",
    zip: "561 16",
    mapLink: "https://maps.app.goo.gl/ArFj6T9S9ih1TWbJ7",
  },
  socials: {
    facebook: "https://www.facebook.com/ZSaMSLibchavy/"
  },
  //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
  domain: "https://archiv.zslibchavy.cz",
  // Passing the isProduction variable for use in HTML templates
  isProduction: process.env.ELEVENTY_ENV === "PROD",
};