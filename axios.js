import axios from 'axios';

// Set the base URL of your backend server
axios.defaults.baseURL = 'http://1.1.1.250:9000'; // Replace with your actual backend server URL

// Now you can use Axios to make API requests with relative URLs
axios
  .get('/api/users')
  .then((response) => {
    console.log('Users:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

export default axios;
