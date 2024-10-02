// log.js
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  try {
    const response = await fetch('https://zone01normandie.org/api/auth/signin', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('jwt', token);
      alert('Login successful');
    } else { 
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    localStorage.removeItem('jwt');
    alert('Logout successful');
  } catch (error) {
    console.error(error);
  }
});
