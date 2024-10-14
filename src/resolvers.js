const graphqlEndpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const signinEndpoint = 'https://zone01normandie.org/api/auth/signin';
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
getLogData(query).then(data => {
  console.log(data);
})
.catch(error => {
  console.error(error);
});
