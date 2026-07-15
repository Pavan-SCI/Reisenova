import { getHotels } from './controllers/hotelController.js';
const req = {};
const res = {
  status: (code) => ({
    json: (data) => console.log(code, data)
  })
};
getHotels(req, res);
