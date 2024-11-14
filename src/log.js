const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginContainer = document.getElementsByClassName('login-container')[0];
const usernameDisplay = document.getElementById('username-display');
const statisticsDisplay = document.getElementById('statistics-display');
var username = loginForm.username.value;
const password = loginForm.password.value;
const emailAdd = localStorage.getItem('email');
const graphqlEndpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const signinEndpoint = 'https://zone01normandie.org/api/auth/signin';
const token = localStorage.getItem('jwt');
var actualUser = username;
const query = `query {
  user {
    id
    firstName
    lastName
    login
    githubId
    totalUp
    totalDown
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

//#####################################################################\\
//####################  LOGOUT BUTTON PART  ###########################\\
//#####################################################################\\
logoutButton.addEventListener('click', async () => {
  try {
    localStorage.removeItem('jwt');
    loginContainer.style.display = 'block';
    usernameDisplay.textContent = '';
    statisticsDisplay.innerHTML = '';
    document.getElementById('circular-diagram-container').style.display="none"
    document.getElementById('bar-chart-container').style.display="none"
    alert('Logout successful');
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});

//#####################################################################\\
//####################  CHAIN REQUEST PART ############################\\
//#####################################################################\\
const chainRequests = async (event) => {
  event.preventDefault();
    try {
      const auth = username || emailAdd;
      const response = await fetch(signinEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${auth}:${password}`)}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Token:', data);
        const token = data;
        localStorage.setItem('jwt', token);
        // Update UI
        loginContainer.style.display = 'none';
        
        getLogData(query).then(data => {
          console.log(data);
          if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(auth)) {
            username = data.user[0].firstName;
          }
          actualUser = data.user[0].firstName;
          usernameDisplay.textContent = `Welcome, ${actualUser}!`;
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

//#####################################################################\\
//####################  GET DATA PART  ################################\\
//#####################################################################\\
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

//#####################################################################\\
//####################  DISPLAY STATISTICS PART #######################\\
//#####################################################################\\
async function displayStatistics(token) {
  const statsElement = document.getElementById('statistics-display');
  const data = await getLogData(query);
  statsElement.innerHTML = `
    <h2>User Data</h2>
    <h2>Statistics</h2>
    <p>User ID: ${data.user[0].id}</p>
    <p>First Name: ${data.user[0].firstName}</p>
    <p>Last Name: ${data.user[0].lastName}</p>
    <p>Login: ${data.user[0].login}</p>
    <p>Github ID: ${data.user[0].githubId}</p>
    <h2> ${username}'s expreriences</h2>
    <p>Given experiences: ${data.user[0].totalUp} xps</p>
    <p>Earned experiences: ${data.user[0].totalDown} xps</p>
    <p>Audit Ratio: ${data.user[0].auditRatio.toFixed(2)}</p>
    <h2>Auditor</h2>
    <p>Auditor Login: ${data.audit[0].auditorLogin}</p>
    <br>
    <button id="barChartButton" onclick="createBarChart()">Display Bar Chart</button>
    <button id="circularButton" onclick="createCircularDiagram()">Display Diagram</button>
  `;
}
  
loginForm.addEventListener('submit', chainRequests);
