import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.figshare.com/v2'
})
