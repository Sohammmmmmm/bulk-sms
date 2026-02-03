import Keycloak from "keycloak-js"; // ✅ use uppercase for imported class

//const keycloak = new Keycloak({
//  url: "http://localhost:8090/", // Keycloak server URL
//  realm: "nishkaiv", // your realm
//  clientId: "nish123", // your client ID
//});


const keycloak = new Keycloak({
  url: "http://43.204.108.73:8081", // Corrected URL - remove "localhost." prefix
  realm: "bulk-sms",
  clientId: "bulk-sms-ui",
});

export default keycloak;

