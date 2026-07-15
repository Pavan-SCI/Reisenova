import fetch from 'node-fetch';

async function test() {
  const getRes = await fetch('http://localhost:3000/api/bookings/user/test1234');
  const data = await getRes.json();
  console.log('Bookings:', JSON.stringify(data));

  if (data.packages && data.packages.length > 0) {
    const id = data.packages[0].id;
    console.log('Cancelling package booking', id);
    const delRes = await fetch(`http://localhost:3000/api/bookings/package/${id}`, { method: 'DELETE' });
    console.log('Delete response:', delRes.status, await delRes.text());
  }
}
test();
