// utils/auth0.ts
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'dev-jbrriuc5vyjmiwtx.us.auth0.com',         // ✅ Replace with your Auth0 domain
  clientId: 'HHkjs4uACOc1O27m3v865SJqbMdAcEfZ',      // ✅ Replace with your Auth0 client ID
});

export default auth0;
