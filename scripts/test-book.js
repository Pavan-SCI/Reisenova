import fetch from 'node-fetch';
async function test() {
  const res = await fetch('http://localhost:3000/api/bookings/package', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'test1234',
      userEmail: 'test1234@example.com',
      packageId: '7-day-cultural-triangle',
      packageDetails: { title: 'Test' }
    })
  });
  console.log(await res.json());

  const getRes = await fetch('http://localhost:3000/api/bookings/user/test1234');
  console.log(await getRes.json());
}
test();
