import { bookHotel } from './controllers/bookingController.js';
const req = {
  body: {
    userId: "test",
    hotelId: "test",
    hotelDetails: {},
    guests: 1
  }
};
const res = {
  status: (code) => ({
    json: (data) => console.log(code, data)
  })
};
bookHotel(req, res);
