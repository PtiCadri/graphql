
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginContainer = document.getElementsByClassName('login-container')[0];
const usernameDisplay = document.getElementById('username-display');
const statisticsDisplay = document.getElementById('statistics-display');
const username = loginForm.username.value;
const password = loginForm.password.value;
const graphqlEndpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const signinEndpoint = 'https://zone01normandie.org/api/auth/signin';
const token = localStorage.getItem('jwt');
const query = `query {
  user {
    id
    firstName
    lastName
    login
    githubId
    auditRatio
    xps {
      amount
      originEventId
      path
      userId
    }
  }
  audit {
    auditorLogin
  }
}`   

//Logout Button Part 
logoutButton.addEventListener('click', async () => {
  try {
    localStorage.removeItem('jwt');
    loginContainer.style.display = 'block';
    usernameDisplay.textContent = '';
    statisticsDisplay.innerHTML = '';
    alert('Logout successful');
  } catch (error) {
    console.error(error);
  }
});

//Login Form Part with chainRequests
const chainRequests = async (event) => {

  event.preventDefault();

    try {
      const response = await fetch(signinEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log('Token:', data);
        const token = data;
        localStorage.setItem('jwt', token);

        
        // Update UI
        loginContainer.style.display = 'none';
        usernameDisplay.textContent = `Welcome, ${username}!`;
        getLogData(query).then(data => {
          console.log(data);
        }).catch(error => {
          console.error(error);
        })
        displayStatistics(token);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
    }
};


async function getLogData(query) {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } 

  const data = await response.json();
    if (data.errors) {
      throw new Error('GraphQL error:',data.errors[0].message);
    }
  return data.data;
}

async function displayStatistics(token) {
  const statsElement = document.getElementById('statistics-display');
  getLogData(query).then(statsData => {
    //console.log("stat", statsData);
    statsElement.innerHTML = `
      <h2>User Data</h2>
      <h2>Statistics</h2>
      <p>User ID: ${statsData.user[0].id}</p>
      <p>First Name: ${statsData.user[0].firstName}</p>
      <p>Last Name: ${statsData.user[0].lastName}</p>
      <p>Login: ${statsData.user[0].login}</p>
      <p>Github ID: ${statsData.user[0].githubId}</p>
      <p>Audit Ratio: ${statsData.user[0].auditRatio}</p>
      <h2>Auditor</h2>
      <p>Auditor Login: ${statsData.audit[0].auditorLogin}</p>
     
    `;
  });
}

loginForm.addEventListener('submit', chainRequests);
