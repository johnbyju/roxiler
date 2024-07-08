import axios from 'axios';

const HostConnection = axios.create({
  baseURL: 'http://localhost:5000/roxiler'
});

export default HostConnection;